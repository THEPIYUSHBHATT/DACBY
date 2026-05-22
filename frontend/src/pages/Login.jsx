import { useState, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'

const Login = ({ mode = 'login' }) => {
  const isLogin = mode === 'login'
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
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2 className="auth-title">{isLogin ? 'Login' : 'Register'}</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="form-input"
          />
          <div className="password-field">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-input"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="password-toggle"
              title={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <button type="submit" className="btn-primary">
            {isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>
        {error && <p className="error-msg">{error}</p>}
        <p className="auth-footer">
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <span
            onClick={() => {
              navigate(isLogin ? '/register' : '/login')
              setError('')
            }}
            className="auth-footer-link"
          >
            {isLogin ? 'Register' : 'Login'}
          </span>
        </p>
      </div>
    </div>
  )
}

export default Login
