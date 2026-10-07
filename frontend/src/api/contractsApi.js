import api from './axios'

export function listMyContracts({ skip = 0, limit = 20 } = {}) {
  return api.get('/contracts/me', { params: { skip, limit } })
}

export function getContract(id) {
  return api.get(`/contracts/${id}`)
}

export function createContract(payload) {
  return api.post('/contracts/', payload)
}

export function updateContract(id, payload) {
  return api.put(`/contracts/${id}`, payload)
}

export function deleteContract(id) {
  return api.delete(`/contracts/${id}`)
}
