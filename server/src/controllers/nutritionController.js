import { query } from '../db/index.js'
import { awardBadgesForUser } from '../services/badges.js'

export async function saveNutrition(req, res, next) {
  try {
    const { calories = 0, macros = {} } = req.body
    const userId    = req.session.userId
    // store only the date portion
    const date      = new Date().toISOString().slice(0, 10)

    // upsert the log, casting macros as JSONB
    await query(
      `INSERT INTO nutrition_logs (user_id, date, calories, macros)
         VALUES ($1, $2, $3, $4::jsonb)
       ON CONFLICT (user_id, date) DO UPDATE
         SET calories = EXCLUDED.calories,
             macros   = EXCLUDED.macros`,
      [userId, date, calories, JSON.stringify(macros)]
    )

    // grab all log dates back as plain text
    const { rows } = await query(
      `SELECT date::text AS date
         FROM nutrition_logs
        WHERE user_id = $1
        ORDER BY date DESC`,
      [userId]
    )

    // build a set of unique dates
    const uniqueDates = Array.from(
      new Set(rows.map(r => r.date))
    )

    // compute consecutive day streak ending today
    let nutritionStreak = 0
    // starts as today
    let cursor = new Date()
    for (let d of uniqueDates) {
      const dStr = cursor.toISOString().slice(0,10)
      if (d === dStr) {
        nutritionStreak++
        cursor.setDate(cursor.getDate() - 1)
      } else {
        break
      }
    }

    // build minimal stats object for badge logic
    // hold all the data needed to award badges
    const stats = {
      weeklyCount:     0,
      monthlyCount:    0,
      workoutGoals:    {},
      nutritionData:   { calories, ...macros },
      nutritionGoals:  {},
      nutritionStreak
    }

    // make the function that is going to do the awarding
    const badges = await awardBadgesForUser(userId, stats)
    return res.json({ badges })
  } catch (err) {
    return next(err)
  }
}