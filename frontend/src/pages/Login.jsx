import { useState, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'

const Login = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const { login, register } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      if (isLogin) {
        await login(username, password)
      } else {
        await register(username, password)
      }
      navigate('/')
    } catch (error) {
      setError(error.response?.data?.message || 'Something went wrong')
    }
  }

  return (
    <div
      style={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '400px',
          textAlign: 'center',
          padding: '2rem',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          borderRadius: '8px',
          background: '#fff',
        }}
      >
        <h2>{isLogin ? 'Login' : 'Register'}</h2>
        <form
          onSubmit={handleSubmit}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            marginTop: '1.5rem',
          }}
        >
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{ padding: '0.5rem', width: '100%', boxSizing: 'border-box' }}
          />
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ padding: '0.5rem', width: '100%', boxSizing: 'border-box' }}
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '10px',
                cursor: 'pointer',
                userSelect: 'none',
                display: 'flex',
                alignItems: 'center',
                color: '#666'
              }}
              title={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </span>
          </div>
          <button
            type="submit"
            style={{
              padding: '0.5rem',
              background: '#ff6600',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            {isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>
        {error && (
          <p style={{ color: 'red', margin: '1rem 0 0', fontSize: '0.9rem' }}>
            {error}
          </p>
        )}
        <p style={{ marginTop: '1.5rem', marginBottom: 0 }}>
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <span
            onClick={() => {
              setIsLogin(!isLogin)
              setError('')
            }}
            style={{
              cursor: 'pointer',
              color: 'blue',
              textDecoration: 'underline',
            }}
          >
            {isLogin ? 'Register' : 'Login'}
          </span>
        </p>
      </div>
    </div>
  )
}

export default Login
