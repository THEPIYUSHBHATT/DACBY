import axios from 'axios'
import * as cheerio from 'cheerio'
import Story from '../models/Story.js'

export const scrapeStories = async (io = null) => {
  try {
    console.log('Starting Hacker News scraper...')
    const { data } = await axios.get('https://news.ycombinator.com/')
    const $ = cheerio.load(data)
    const stories = []

    // Each story on HN is a <tr class="athing">, followed by a sibling <tr> with metadata
    $('.athing')
      .slice(0, 10)
      .each((index, element) => {
        const el = $(element)

        const hnId = el.attr('id')
        const titleElement = el.find('.titleline > a').first()
        const title = titleElement.text()
        let url = titleElement.attr('href')

        // Internal HN links are relative paths like "item?id=123"
        if (url && url.startsWith('item?id=')) {
          url = `https://news.ycombinator.com/${url}`
        }

        const subtextRow = el.next()
        const pointsText = subtextRow.find('.score').text()
        const points = pointsText ? parseInt(pointsText.replace(/\D/g, ''), 10) : 0
        const author = subtextRow.find('.hnuser').text() || ''
        
        // Try getting ISO datetime, fallback to absolute title, and then relative text
        const ageElement = subtextRow.find('.age')
        const postedAt = 
          ageElement.find('time').attr('datetime') || 
          ageElement.attr('title') || 
          ageElement.find('a').attr('title') || 
          ageElement.text().trim() || 
          ''

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

    // Use bulkWrite to execute all 10 operations in a single database round-trip
    const bulkOps = stories.map((storyData) => ({
      updateOne: {
        filter: { hnId: storyData.hnId },
        update: { $set: storyData },
        upsert: true,
      },
    }))

    await Story.bulkWrite(bulkOps)

    console.log('Scraping and DB update complete.')

    // Push live update to all connected clients
    if (io) {
      io.emit('newScrape', stories)
    }

    return stories
  } catch (error) {
    console.error('Error during scraping:', error.message)
    throw error
  }
}
