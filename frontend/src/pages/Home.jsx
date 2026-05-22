import { useState, useEffect, useContext, useRef } from 'react'
import io from 'socket.io-client'
import { AuthContext } from '../context/AuthContext'
import { fetchStoriesAPI, toggleBookmarkAPI, getMyBookmarksAPI } from '../services/storyService'
import { Bookmark } from 'lucide-react'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'

// Single persistent socket — created once at module level to avoid reconnecting on every render
const socket = io(BACKEND_URL)

const Home = () => {
  const [stories, setStories] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [bookmarkedIds, setBookmarkedIds] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useContext(AuthContext)
  const bookmarksFetched = useRef(false)

  const fetchStories = async (p = 1, signal = null) => {
    setLoading(true)
    try {
      const { data } = await fetchStoriesAPI(p, 10, { signal })
      setStories(data.stories)
      setPage(data.page)
      setTotalPages(data.pages)
    } catch (error) {
      if (error.name === 'CanceledError') return // Ignore aborted requests
      console.error('Error fetching stories:', error)
    } finally {
      setLoading(false)
    }
  }

  // Fetch user's bookmarks once after login so we can highlight them in the list
  useEffect(() => {
    if (user && !bookmarksFetched.current) {
      bookmarksFetched.current = true
      getMyBookmarksAPI()
        .then(({ data }) => setBookmarkedIds(data.map((b) => b._id)))
        .catch(() => {})
    }
    if (!user) {
      bookmarksFetched.current = false
      setBookmarkedIds([])
    }
  }, [user])

  useEffect(() => {
    const abortController = new AbortController()
    fetchStories(page, abortController.signal)
    
    // Cleanup: abort the fetch if the component unmounts or page changes quickly
    return () => abortController.abort()
  }, [page])

  // Refresh the feed when the scraper pushes new data via WebSocket
  useEffect(() => {
    const handleNewScrape = () => {
      fetchStories(page)
    }
    socket.on('newScrape', handleNewScrape)
    return () => socket.off('newScrape', handleNewScrape)
  }, [page])

  const toggleBookmark = async (id) => {
    if (!user) return alert('Please login to bookmark stories')
    try {
      const { data } = await toggleBookmarkAPI(id)
      setBookmarkedIds(data.bookmarks)
    } catch (error) {
      console.error(error)
      alert('Error toggling bookmark')
    }
  }

  if (loading && stories.length === 0) {
    return <div className="loading">Loading stories...</div>
  }

  return (
    <div className="page-container">
      <h2 className="page-title">Top Hacker News Stories</h2>
      <ul className="story-list">
        {stories.map((story, index) => (
          <li key={story._id} className="story-item">
            <div className="story-content">
              <a
                href={story.url}
                target="_blank"
                rel="noreferrer"
                className="story-link"
              >
                {index + 1 + (page - 1) * 10}. {story.title}
              </a>
              <p className="story-meta">
                {[
                  story.points ? `${story.points} points` : null,
                  story.author ? `by ${story.author}` : null,
                  story.postedAt ? story.postedAt : null,
                ]
                  .filter(Boolean)
                  .join(' | ')}
              </p>
            </div>
            {user && (
              <button
                onClick={() => toggleBookmark(story._id)}
                className={`bookmark-btn ${bookmarkedIds.includes(story._id) ? 'active' : ''}`}
                title={
                  bookmarkedIds.includes(story._id)
                    ? 'Remove bookmark'
                    : 'Add bookmark'
                }
              >
                <Bookmark 
                  size={20} 
                  fill={bookmarkedIds.includes(story._id) ? "currentColor" : "none"} 
                />
              </button>
            )}
          </li>
        ))}
      </ul>

      <div className="pagination">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="pagination-btn"
        >
          Previous
        </button>
        <span className="page-info">
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="pagination-btn"
        >
          Next
        </button>
      </div>
    </div>
  )
}

export default Home