import api from './axios'

export function getMe() {
  return api.get('/users/me')
}

export function updateMe(payload) {
  return api.patch('/users/me', payload)
}

export function changePassword(payload) {
  return api.post('/users/me/password', payload)
}

export function getUserById(userId) {
  return api.get(`/users/${userId}`)
}

export function requestPasswordReset(email) {
  return api.post('/users/password-reset/request', { email })
}

export function confirmPasswordReset(token, new_password) {
  return api.post('/users/password-reset/confirm', { token, new_password })
}

export function requestEmailVerification() {
  return api.post('/users/me/verify-email/request')
}

export function confirmEmailVerification(token) {
  return api.post('/users/verify-email/confirm', { token })
}
