import express from 'express'

// make the router object
const router = express.Router()

// use the get request to give back the user signed in
router.get('/', (req, res) => {
  res.json({ message: `Hello user ${req.session.userId}` })
})
export default router