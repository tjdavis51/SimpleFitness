import express from 'express';
import { getBadgesForUser } from '../services/badges.js';
import { requireAuth } from '../middleware/authMiddleware.js';

// make a router object for navigation
const router = express.Router();
// make sure the user is authorized
router.use(requireAuth);

// use get to fetch all the badges earned by the user
router.get('/', async (req, res, next) => {
  try {
    // look up the badges for the user stored in the session
    const badges = await getBadgesForUser(req.session.userId);
    // send it back as json
    res.json({ badges });
  } catch (err) {
    next(err);
  }
});

export default router;