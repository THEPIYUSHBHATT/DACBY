import { createContext, useState, useEffect } from 'react'
import { loginAPI, registerAPI } from '../services/authService'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || null)
  const [user, setUser] = useState(token ? { token } : null)

  useEffect(() => {
    // Because we are using apiConnector interceptors now,
    // we don't need to manually configure axios default headers here!
    if (token) {
      setUser({ token })
    } else {
      setUser(null)
    }
  }, [token])

  const login = async (username, password) => {
    const { data } = await loginAPI(username, password)
    localStorage.setItem('token', data.token)
    setToken(data.token)
  }

  const register = async (username, password) => {
    const { data } = await registerAPI(username, password)
    localStorage.setItem('token', data.token)
    setToken(data.token)
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
