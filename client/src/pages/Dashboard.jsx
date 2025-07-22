import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../contexts/AuthContext'

// in case there is no valid data use the safe load to parse
// the json, it takes in the part to parse and the return if it gets an error
const safeLoad = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key)
    if (raw) return JSON.parse(raw)
  } catch {
  }
  return fallback
}

// compute the start of the week and the month
const startOfWeek = () => {
  const now = new Date()
  now.setDate(now.getDate() - now.getDay())
  now.setHours(0, 0, 0, 0)
  return now
}
const startOfMonth = () => {
  const now = new Date()
  now.setDate(1)
  now.setHours(0, 0, 0, 0)
  return now
}

// add in the bootstrap progress bar
const progressBar = (value, max) => {
  // get the percentage 
  const pct = Math.min((value / max) * 100, 100)
  // then add in the bar with the percent
  return (
    <div className="progress mb-2">
      <div
        className="progress-bar bg-success"
        role="progressbar"
        style={{ width: `${pct}%` }}
      >
        {value}/{max}
      </div>
    </div>
  )
}

// make the dashboard component
export default function Dashboard() {
  // get the user and logout functions
  const { user, logout } = useContext(AuthContext)
  // get the current day in ISO format by using slice
  const todayStr = new Date().toISOString().slice(0, 10)
  // load workout goals
  const workoutGoals = safeLoad(
    'simplefitness-workout-goals',
    { week: 3, month: 12 }
  )

  // load the workouts
  const workouts = safeLoad('simplefitness-completed-workouts', [])
  const weeklyCount = workouts.filter(
    (d) => new Date(d.date) >= startOfWeek()
  ).length
  const monthlyCount = workouts.filter(
    (d) => new Date(d.date) >= startOfMonth()
  ).length

  // load nutrition goals
  const nutritionGoals = safeLoad(
    'simplefitness-nutrition-goals',
    { calories: 2000, carbs: 250, protein: 150, fat: 70 }
  )

  // load the logs from the day
  const rawNutrition = safeLoad(
    'simplefitness-nutrition',
    { date: '', calories: 0, macros: { carbs: 0, protein: 0, fat: 0 } }
  )

  // put it all together
  const nutritionData =
    rawNutrition.date === todayStr
      ? { calories: rawNutrition.calories, macros: rawNutrition.macros }
      : { calories: 0, macros: { carbs: 0, protein: 0, fat: 0 } }

  return (
    <div className="container py-4">
      {/* navbar */}
      <nav className="mb-4 d-flex align-items-center">
  <div className="btn-group">
    <Link to="/dashboard" className="btn btn-success btn-sm">
      Dashboard
    </Link>
    <Link to="/goals" className="btn btn-success btn-sm">
      Goals
    </Link>
    <Link to="/videos" className="btn btn-success btn-sm">
      Videos
    </Link>
    <Link to="/workout" className="btn btn-success btn-sm">
      Workout
    </Link>
    <Link to="/nutrition" className="btn btn-success btn-sm">
      Nutrition
    </Link>
  </div>
  <button
    onClick={logout}
    className="btn btn-sm btn-outline-danger ms-auto"
  >
    Sign Out
  </button>
</nav>

      <h1>Hello, {user?.name || 'Guest'}</h1>
      <p>Welcome back! Here’s your progress for today:</p>

      {/* latest Workout */}
      <div className="card mb-3">
        <div className="card-header d-flex justify-content-between align-items-center">
          Latest Workout
          <Link to="/workout" className="btn btn-sm btn-success">
            View All
          </Link>
        </div>
        <div className="card-body">
          {workouts.length > 0 ? (
            <ul>
              {workouts[workouts.length - 1].plan.map((item, idx) => (
                <li key={idx}>
                  {item.exercise} — {item.duration} min
                </li>
              ))}
            </ul>
          ) : (
            <p>
              No workouts logged yet.{' '}
              <Link to="/workout">Start one now</Link>.
            </p>
          )}
        </div>
      </div>

      {/* goals and nutrition row */}
      <div className="row">
        {/* current goals */}
        <div className="col-md-6 mb-3">
          <div className="card">
            <div className="card-header">Current Goals</div>
            <div className="card-body">
              <h6>Weekly Workouts</h6>
              {progressBar(weeklyCount, workoutGoals.week)}
              <h6>Monthly Workouts</h6>
              {progressBar(monthlyCount, workoutGoals.month)}
              <Link to="/goals" className="btn btn-sm btn-success mt-2">
                Edit Goals
              </Link>
            </div>
          </div>
        </div>

        {/* today's nutrition */}
        <div className="col-md-6 mb-3">
          <div className="card">
            <div className="card-header">Today's Nutrition</div>
            <div className="card-body">
              <h6>Calories</h6>
              {progressBar(
                nutritionData.calories,
                nutritionGoals.calories
              )}

              {['carbs', 'protein', 'fat'].map((key) => (
                <React.Fragment key={key}>
                  <h6>
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </h6>
                  {progressBar(
                    nutritionData.macros[key],
                    nutritionGoals[key]
                  )}
                </React.Fragment>
              ))}

              <Link to="/nutrition" className="btn btn-sm btn-success mt-2">
                Log Nutrition
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* keep watching section */}
      <div className="card mb-3">
        <div className="card-header">Keep Watching</div>
        <div className="card-body">
          <p>
            Continue watching your videos on the{' '}
            <Link to="/videos">Videos Page</Link>.
          </p>
        </div>
      </div>
    </div>
  )
}