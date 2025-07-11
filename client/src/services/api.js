import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  withCredentials: true
})

export const signUp = data => api.post('/auth/signup', data)
export const signIn = data => api.post('/auth/signin', data)
export const signOut = () => api.post('/auth/signout')
export const fetchMe = () => api.get('/auth/me')
export const getDash = () => api.get('/dashboard')