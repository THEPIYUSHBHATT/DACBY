import { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { getMyBookmarksAPI } from '../services/authService'

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useContext(AuthContext)

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
    if (user) fetchBookmarks()
  }, [user])

  if (!user)
    return (
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        Please login to view bookmarks.
      </div>
    )

  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '2.5rem', fontSize: '1.1rem' }}>
        Loading bookmarks...
      </div>
    )
  }

  return (
    <div
      style={{
        maxWidth: '800px',
        margin: '2rem auto',
        fontFamily: 'sans-serif',
      }}
    >
      <h2>My Bookmarks</h2>
      {bookmarks.length === 0 ? (
        <p>No bookmarks yet.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {bookmarks.map((story) => (
            <li
              key={story._id}
              style={{ padding: '1rem', borderBottom: '1px solid #ccc' }}
            >
              <a
                href={story.url}
                target="_blank"
                rel="noreferrer"
                style={{
                  textDecoration: 'none',
                  color: '#000',
                  fontWeight: 'bold',
                }}
              >
                {story.title}
              </a>
              <p
                style={{
                  margin: '5px 0 0 0',
                  fontSize: '0.8rem',
                  color: '#555',
                }}
              >
                {story.points} points by {story.author}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Bookmarks
