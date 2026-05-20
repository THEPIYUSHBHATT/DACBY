import { scrapeStories } from '../services/scraperService.js'

export const triggerScrape = async (req, res) => {
  try {
    const stories = await scrapeStories()
    res
      .status(200)
      .json({ message: 'Scraping successful', count: stories.length, stories })
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Failed to scrape data', error: error.message })
  }
}
