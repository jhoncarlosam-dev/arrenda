import axios from 'axios'
import { getApiErrorMessage } from '../utils/apiErrors'
import { isTokenExpired } from '../utils/jwt'

export const TOKEN_KEY = 'arrenda_token'
export const TOKEN_STORE_KEY = 'arrenda_token_store'

export function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY)
}

export function persistToken(token, remember) {
  clearToken()
  const store = remember ? localStorage : sessionStorage
  store.setItem(TOKEN_KEY, token)
  localStorage.setItem(TOKEN_STORE_KEY, remember ? 'local' : 'session')
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
  sessionStorage.removeItem(TOKEN_KEY)
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1',
  timeout: 20000,
})

let onUnauthorized = () => {}

export function setUnauthorizedHandler(fn) {
  onUnauthorized = fn
}

api.interceptors.request.use((config) => {
  const token = getStoredToken()
  if (token && !isTokenExpired(token)) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    const url = error.config?.url || ''
    const isLogin = url.includes('/auth/login')
    if (status === 401 && !isLogin) {
      onUnauthorized(getApiErrorMessage(error))
    }
    return Promise.reject(error)
  },
)

export default api
