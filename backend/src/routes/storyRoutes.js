import express from 'express'
import {
  getStories,
  getStoryById,
  toggleBookmark,
  getMyBookmarks,
} from '../controllers/storyController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()
router.get('/', getStories)
router.get('/bookmarks', protect, getMyBookmarks)
router.get('/:id', getStoryById)
router.post('/:id/bookmark', protect, toggleBookmark)

export default router
