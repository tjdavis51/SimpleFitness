import express from 'express'
import { saveNutrition } from '../controllers/nutritionController.js'
import { requireAuth } from '../middleware/authMiddleware.js'

// make the router object for navigation
const router = express.Router()

// make sure the user is signed in
router.use(requireAuth)

// use post to save the nutriton data
router.post('/save', saveNutrition)

export default router