import express from 'express'
import { signUp, signIn, signOut, fetchMe } from '../controllers/authController.js'
import { requireAuth } from '../middleware/authMiddleware.js'

const router = express.Router()
router.post('/signup', signUp)
router.post('/signin', signIn)
router.post('/signout', signOut)
router.get('/me', requireAuth, fetchMe)
export default router