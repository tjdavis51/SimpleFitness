import express from 'express'
// import the authentication functions
import { signUp, signIn, signOut, fetchMe } from '../controllers/authController.js'
import { requireAuth } from '../middleware/authMiddleware.js'

// make a router to handle the navigation
const router = express.Router()
// make the http posts to each page and api endpoint
router.post('/signup', signUp)
router.post('/signin', signIn)
router.post('/signout', signOut)
router.get('/me', requireAuth, fetchMe)
export default router