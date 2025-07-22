import axios from 'axios'

// create a shared axios instance pointing at the backend
const api = axios.create({
  baseURL: '/api',
  withCredentials: true
})

// auth endpoints
export const signUp = data => api.post('/auth/signup', data)
export const signIn = data => api.post('/auth/signin', data)
export const signOut = () => api.post('/auth/signout')
export const fetchMe = () => api.get('/auth/me')

// dashboard endpoint
export const getDash = () => api.get('/dashboard')

// workout and nutrition logging
// this triggers the badges
export const logWorkout = payload => api.post('/workout/log', payload)
export const saveNutrition = payload => api.post('/nutrition/save', payload)

// export the api to be used
export default api