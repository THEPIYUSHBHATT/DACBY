import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import http from 'http'
import { Server } from 'socket.io'
import connectDB from './src/config/db.js'

// Route Imports
import scraperRoutes from './src/routes/scraperRoutes.js'
import authRoutes from './src/routes/authRoutes.js'
import storyRoutes from './src/routes/storyRoutes.js'
import { scrapeStories } from './src/services/scraperService.js'

dotenv.config()

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})

// Pass io to scraper service so it can emit events
app.set('io', io)

// Connect to database
connectDB().then(() => {
  // Trigger scraper on server start, passing the io instance
  scrapeStories(io)
})

// Middleware
app.use(cors())
app.use(express.json())

// API Routes
app.use('/api', scraperRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/stories', storyRoutes)

// Basic route to test server
app.get('/', (req, res) => {
  res.send('API is running...')
})

const PORT = process.env.PORT || 5000

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
