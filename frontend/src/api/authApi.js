import api from './axios'

export function login(email, password) {
  return api.post('/auth/login', { email, password })
}

export function register(payload) {
  return api.post('/users/', payload)
}
