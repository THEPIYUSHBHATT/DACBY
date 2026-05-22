import { scrapeStories } from '../services/scraperService.js'

export const triggerScrape = async (req, res) => {
  try {
    // Grab the socket.io instance so API-triggered scrapes also broadcast live
    const io = req.app.get('io')
    const stories = await scrapeStories(io)
    res
      .status(200)
      .json({ message: 'Scraping successful', count: stories.length, stories })
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Failed to scrape data', error: error.message })
  }
}
