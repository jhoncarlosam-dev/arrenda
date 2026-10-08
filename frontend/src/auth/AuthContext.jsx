import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { login as loginRequest } from '../api/authApi'
import {
  clearToken,
  getStoredToken,
  persistToken,
  setUnauthorizedHandler,
} from '../api/axios'
import { getMe } from '../api/usersApi'
import { getApiErrorMessage } from '../utils/apiErrors'
import { isTokenExpired } from '../utils/jwt'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => getStoredToken())
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const logout = useCallback((message) => {
    clearToken()
    setToken(null)
    setUser(null)
    if (message) toast.error(message)
  }, [])

  const refreshUser = useCallback(async () => {
    const stored = getStoredToken()
    if (!stored) {
      setToken(null)
      setUser(null)
      setLoading(false)
      return null
    }
    if (isTokenExpired(stored)) {
      logout('Tu sesión ha expirado. Inicia sesión nuevamente.')
      setLoading(false)
      return null
    }
    try {
      const { data } = await getMe()
      setUser(data)
      setToken(stored)
      return data
    } catch (error) {
      if (error.response?.status !== 401) {
        toast.error(getApiErrorMessage(error))
      }
      return null
    } finally {
      setLoading(false)
    }
  }, [logout])

  useEffect(() => {
    setUnauthorizedHandler(() => {
      logout('Tu sesión ha expirado. Inicia sesión nuevamente.')
    })
    refreshUser()
    return () => setUnauthorizedHandler(() => {})
  }, [logout, refreshUser])

  const login = useCallback(
    async (email, password, remember) => {
      const { data } = await loginRequest(email, password)
      persistToken(data.access_token, remember)
      setToken(data.access_token)
      setLoading(true)
      const me = await refreshUser()
      return me
    },
    [refreshUser],
  )

  const value = useMemo(
    () => ({
      token,
      user,
      loading,
      login,
      logout,
      refreshUser,
      isAuthenticated: Boolean(token && user),
      role: user?.role,
    }),
    [token, user, loading, login, logout, refreshUser],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return ctx
}
