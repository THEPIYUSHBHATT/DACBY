import { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

const Navbar = () => {
  const { user, logout } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav
      style={{
        padding: '1rem',
        background: '#ff6600',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <h2 style={{ margin: 0 }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
          Hacker News Clone
        </Link>
      </h2>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {user ? (
          <>
            <Link to="/" style={{ color: 'white', marginRight: '1rem' }}>
              Stories
            </Link>
            <Link
              to="/bookmarks"
              style={{ color: 'white', marginRight: '1rem' }}
            >
              Bookmarks
            </Link>
            <button
              onClick={handleLogout}
              style={{
                background: 'transparent',
                border: '1px solid white',
                color: 'white',
                cursor: 'pointer',
                padding: '5px 10px',
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            to="/login"
            style={{
              color: 'white',
              fontSize: '1.2rem',
              textDecoration: 'none',
              fontWeight: 'bold',
              underline: 'underline',
            }}
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  )
}

export default Navbar
