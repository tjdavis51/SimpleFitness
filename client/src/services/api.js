// import axios which will shorten the fetch statements
import axios from 'axios'

// create an api object using axios
const api = axios.create({
  baseURL: '/api',
  withCredentials: true
})

// use the api object to make routes for each page
export const signUp = data => api.post('/auth/signup', data)
export const signIn = data => api.post('/auth/signin', data)
export const signOut = () => api.post('/auth/signout')
export const fetchMe = () => api.get('/auth/me')
export const getDash = () => api.get('/dashboard')