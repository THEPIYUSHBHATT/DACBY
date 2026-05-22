import Story from '../models/Story.js'
import User from '../models/User.js'

export const getStories = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    const stories = await Story.find()
      .sort({ points: -1 })
      .skip(skip)
      .limit(limit)
    const total = await Story.countDocuments()

    res.json({ stories, page, pages: Math.ceil(total / limit), total })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

export const getStoryById = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id)
    if (!story) return res.status(404).json({ message: 'Story not found' })
    res.json(story)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

export const toggleBookmark = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    const storyId = req.params.id
    const isBookmarked = user.bookmarks.includes(storyId)

    if (isBookmarked) {
      user.bookmarks = user.bookmarks.filter(
        (id) => id.toString() !== storyId,
      )
    } else {
      user.bookmarks.push(storyId)
    }

    await user.save()
    res.json({
      message: isBookmarked ? 'Bookmark removed' : 'Bookmark added',
      bookmarks: user.bookmarks,
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

export const getMyBookmarks = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('bookmarks')
    res.json(user.bookmarks)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}
