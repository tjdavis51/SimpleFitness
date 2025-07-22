import { query } from '../db/index.js'

// fetch all the badges for the user
export async function getBadgesForUser(userId) {
  const { rows } = await query(
    `SELECT type, awarded_at
       FROM badges
      WHERE user_id = $1
      ORDER BY awarded_at DESC`,
    [userId]
  )
  return rows
}

// stats: { weeklyCount, monthlyCount, totalWorkouts, streakDays, nutritionData, workoutGoals, nutritionGoals, nutritionStreak }
// use the stats to define the badges
// define met as either true or false for each one
export async function awardBadgesForUser(userId, stats) {
  const possible = [
    // milestones style badges
    { type: 'first_workout', met: stats.totalWorkouts >= 1 },
    { type: '10_workouts', met: stats.totalWorkouts >= 10 },
    { type: '50_workouts', met: stats.totalWorkouts >= 50 },
    // streak style badges
    { type: '3_day_workout_streak', met: stats.streakDays >= 3 },
    { type: '7_day_workout_streak', met: stats.streakDays >= 7 },
    { type: '7_day_nutrition_streak', met: stats.nutritionStreak >= 7 },
    // goal style badges
    { type: 'weekly_goal_met', met: stats.weeklyCount >= stats.workoutGoals.week },
    { type: 'monthly_goal_met', met: stats.monthlyCount >= stats.workoutGoals.month },
    { type: 'calorie_goal_met', met: stats.nutritionData.calories >= stats.nutritionGoals.calories },
    { type: 'carb_goal_met', met: stats.nutritionData.carbs >= stats.nutritionGoals.carbs },
    { type: 'protein_goal_met', met: stats.nutritionData.protein >= stats.nutritionGoals.protein },
    { type: 'fat_goal_met', met: stats.nutritionData.fat >= stats.nutritionGoals.fat }
  ]

  // for each badge loop through them to see if it needs to be inserted into completed badges
  for (const { type, met } of possible) {
    if (!met) continue
    await query(
      `INSERT INTO badges (user_id, type) VALUES ($1, $2)
       ON CONFLICT DO NOTHING`,
      [userId, type]
    )
  }

  return getBadgesForUser(userId)
}