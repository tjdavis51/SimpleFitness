import { query } from '../db/index.js'
import { awardBadgesForUser } from '../services/badges.js'

export async function logPlan(req, res, next) {
  try {
    // get the session's user id
    const userId = req.session.userId
    // start the object to hold the workout and nutrition information
    const {
      plan = [],
      goals = {},
      nutritionData = {},
      nutritionGoals = {}
    } = req.body

    // insert the new workout
    await query(
      `INSERT INTO completed_workouts (user_id, date, plan)
       VALUES ($1, $2, $3::jsonb)`,
      [userId, new Date().toISOString(), JSON.stringify(plan)]
    )

    // get the total workouts so far
    const totalRes = await query(
      `SELECT COUNT(*)::int AS count
         FROM completed_workouts
        WHERE user_id = $1`,
      [userId]
    )
    const totalWorkouts = totalRes.rows[0].count

    // find the weekly counts
    const weekRes = await query(
      `SELECT COUNT(*)::int AS count
         FROM completed_workouts
        WHERE user_id = $1
          AND date >= date_trunc('week', now())`,
      [userId]
    )

    // find the monthly counts
    const monthRes = await query(
      `SELECT COUNT(*)::int AS count
         FROM completed_workouts
        WHERE user_id = $1
          AND date >= date_trunc('month', now())`,
      [userId]
    )

    // save the information
    const weeklyCount  = weekRes.rows[0].count
    const monthlyCount = monthRes.rows[0].count

    // build the stats object for workouts
    const stats = {
      totalWorkouts,
      weeklyCount,
      monthlyCount,
      workoutGoals:   goals,
      nutritionData,
      nutritionGoals
    }

    // award the badges and return them
    const badges = await awardBadgesForUser(userId, stats)
    return res.json({ badges })
  } catch (err) {
    return next(err)
  }
}