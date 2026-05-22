import axios from 'axios'
import * as cheerio from 'cheerio'
import Story from '../models/Story.js'

export const scrapeStories = async (io = null) => {
  try {
    console.log('Starting Hacker News scraper...')
    const { data } = await axios.get('https://news.ycombinator.com/')
    const $ = cheerio.load(data)
    const stories = []

    // Hacker News lists stories in a sequence of tr elements.
    // We'll select the title rows which have the class "athing".
    $('.athing')
      .slice(0, 10)
      .each((index, element) => {
        const el = $(element)

        const hnId = el.attr('id')
        const titleElement = el.find('.titleline > a').first()
        const title = titleElement.text()
        let url = titleElement.attr('href')

        if (url && url.startsWith('item?id=')) {
          url = `https://news.ycombinator.com/${url}`
        }

        // The exact next sibling <tr> contains the subtext (points, author, time)
        const subtextRow = el.next()
        const pointsText = subtextRow.find('.score').text() || '0 points'
        const points = parseInt(pointsText.replace(/\D/g, ''), 10) || 0
        const author = subtextRow.find('.hnuser').text() || 'unknown'
        const postedAt =
          subtextRow.find('.age').attr('title') ||
          subtextRow.find('.age').text() ||
          new Date().toISOString()

        stories.push({
          hnId,
          title,
          url: url || 'https://news.ycombinator.com/',
          points,
          author,
          postedAt,
        })
      })

    console.log(`Scraped ${stories.length} stories. Saving to DB...`)

    // Save to Database (using insertOne/Update with upsert to prevent duplicates)
    for (const storyData of stories) {
      await Story.findOneAndUpdate(
        { hnId: storyData.hnId }, // Search by hnId
        storyData, // Update with fresh points/data
        { upsert: true, returnDocument: 'after' }, // Insert if it does not exist
      )
    }

    console.log('Scraping and DB update complete.')

    // Broadcast real-time update using websockets
    if (io) {
      io.emit('newScrape', stories)
    }

    return stories
  } catch (error) {
    console.error('Error during scraping:', error.message)
    throw error
  }
}
