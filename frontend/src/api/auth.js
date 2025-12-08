import api from './axios'

export const loginApi = (email, password) => api.post('/auth/login', { email, password }).then(r => r.data)
export const registerApi = (payload) => api.post('/auth/register', payload).then(r => r.data)
