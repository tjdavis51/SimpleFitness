import express from 'express'
import { logPlan } from '../controllers/workoutController.js'
import { requireAuth } from '../middleware/authMiddleware.js'

const router = express.Router()

// make sure the user is signed in
router.use(requireAuth)

// use post to save the workout data
router.post('/log', logPlan)

export default router