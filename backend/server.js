import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import http from 'http'
import { Server } from 'socket.io'
import connectDB from './src/config/db.js'

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

// Store io instance so controllers can access it via req.app.get('io')
app.set('io', io)

app.use(cors())
app.use(express.json())

app.use('/api', scraperRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/stories', storyRoutes)

app.get('/', (req, res) => {
  res.send('API is running...')
})

// Run scraper once on startup after DB is ready
connectDB().then(() => {
  scrapeStories(io)
})

const PORT = process.env.PORT || 5000

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
