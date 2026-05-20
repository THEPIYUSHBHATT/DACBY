import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import connectDB from './src/config/db.js'

// Route Imports
import scraperRoutes from './src/routes/scraperRoutes.js'
import { scrapeStories } from './src/services/scraperService.js'

dotenv.config()

// Connect to database
connectDB().then(() => {
  // Trigger scraper on server start
  scrapeStories()
})

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// API Routes
app.use('/api', scraperRoutes)

// Basic route to test server
app.get('/', (req, res) => {
  res.send('API is running...')
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
