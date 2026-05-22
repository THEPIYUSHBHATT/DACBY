import { useState, useEffect, useContext, useRef } from 'react'
import { AuthContext } from '../context/AuthContext'
import { getMyBookmarksAPI } from '../services/storyService'

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useContext(AuthContext)
  const fetchedRef = useRef(false)

  useEffect(() => {
    const fetchBookmarks = async () => {
      setLoading(true)
      try {
        const { data } = await getMyBookmarksAPI()
        setBookmarks(data)
      } catch (error) {
        console.error('Error fetching bookmarks:', error)
      } finally {
        setLoading(false)
      }
    }

    if (user && !fetchedRef.current) {
      fetchedRef.current = true
      fetchBookmarks()
    }
  }, [user])

  if (!user) {
    return <div className="empty-state">Please login to view bookmarks.</div>
  }

  if (loading) {
    return <div className="loading">Loading bookmarks...</div>
  }

  return (
    <div className="page-container">
      <h2 className="page-title">My Bookmarks</h2>
      {bookmarks.length === 0 ? (
        <p className="empty-state">No bookmarks yet.</p>
      ) : (
        <ul className="story-list">
          {bookmarks.map((story) => (
            <li key={story._id} className="story-item">
              <div className="story-content">
                <a
                  href={story.url}
                  target="_blank"
                  rel="noreferrer"
                  className="story-link"
                >
                  {story.title}
                </a>
                <p className="story-meta">
                  {[
                    story.points ? `${story.points} points` : null,
                    story.author ? `by ${story.author}` : null,
                  ]
                    .filter(Boolean)
                    .join(' | ')}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Bookmarks
