import React, { useContext, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../contexts/AuthContext'
import { fetchBadges } from '../services/badges.js'

// use the safe load function again in case of the parse error
// load in the local storage
const safeLoad = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key)
    if (raw) {
      const parsed = JSON.parse(raw)
      return parsed
    }
  } catch (err) {
    console.warn(`Failed to load ${key}:`, err)
  }
  return fallback
}

// make the goals component
export default function Goals() {
  // get the logout function
  const { logout } = useContext(AuthContext)

  // load the saved goals or use the default goals
  const [workoutGoals, setWorkoutGoals] = useState(
    safeLoad('simplefitness-workout-goals', { week: 3, month: 12 })
  )
  const [nutritionGoals, setNutritionGoals] = useState(
    safeLoad('simplefitness-nutrition-goals', {
      calories: 2000,
      carbs: 250,
      protein: 150,
      fat: 70
    })
  )

  // editing buttons
  const [editingWorkout, setEditingWorkout] = useState(false)
  const [editingNutrition, setEditingNutrition] = useState(false)

  // data for progress keeping
  const [completedWorkouts, setCompletedWorkouts] = useState([])
  const [nutritionData, setNutritionData] = useState({ calories: 0, carbs: 0, protein: 0, fat: 0 })

  // earned badges
  const [badgesEarned, setBadgesEarned] = useState([])

  // load the saved workouts and nutrition logs
  useEffect(() => {
    const w = safeLoad('simplefitness-completed-workouts', [])
    setCompletedWorkouts(Array.isArray(w) ? w : [])
    const n = safeLoad('simplefitness-nutrition', null)
    if (n && n.date === new Date().toISOString().slice(0, 10)) {
      setNutritionData({ calories: n.calories, ...n.macros })
    }
  }, [])

  // save the goal targets when they change
  useEffect(() => {
    localStorage.setItem('simplefitness-workout-goals', JSON.stringify(workoutGoals))
  }, [workoutGoals])
  useEffect(() => {
    localStorage.setItem('simplefitness-nutrition-goals', JSON.stringify(nutritionGoals))
  }, [nutritionGoals])

  // fetch the badges from the server
  useEffect(() => {
    fetchBadges()
      .then(res => setBadgesEarned(res.data.badges))
      .catch(err => console.error('Failed to fetch badges:', err))
  }, [])

  // compute the date boundaries for the day and month
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

  // count the number of workouts
  const weeklyCount = completedWorkouts.filter(d => new Date(d.date) >= startOfWeek()).length
  const monthlyCount = completedWorkouts.filter(d => new Date(d.date) >= startOfMonth()).length

  // use the bootstrap progress bar
  const progressBar = (value, max) => {
    // get the percentage
    const pct = Math.min((value / max) * 100, 100)
    return (
      <div className="progress mb-2">
        <div
          className="progress-bar bg-success"
          style={{ width: `${pct}%` }}
        >
          {value}/{max}
        </div>
      </div>
    )
  }

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

      <h1>Goals</h1>

      {/* workout goals */}
      <div className="card my-3">
        <div className="card-header">
          Workout Goals
          {editingWorkout ? (
            <button
              className="btn btn-sm btn-success float-end"
              onClick={() => setEditingWorkout(false)}
            >
              Save
            </button>
          ) : (
            <button
              className="btn btn-sm btn-outline-success float-end"
              onClick={() => setEditingWorkout(true)}
            >
              Edit
            </button>
          )}
        </div>
        <ul className="list-group list-group-flush">
          <li className="list-group-item">
            {editingWorkout ? (
              <>Workout{' '}
                <input
                  type="number"
                  value={workoutGoals.week}
                  onChange={e => setWorkoutGoals({ ...workoutGoals, week: Number(e.target.value) })}
                />
                {' '}times this week
              </>
            ) : (
              <>
                Workout {workoutGoals.week} times this week
                {progressBar(weeklyCount, workoutGoals.week)}
              </>
            )}
          </li>
          <li className="list-group-item">
            {editingWorkout ? (
              <>Workout{' '}
                <input
                  type="number"
                  value={workoutGoals.month}
                  onChange={e => setWorkoutGoals({ ...workoutGoals, month: Number(e.target.value) })}
                />
                {' '}times this month
              </>
            ) : (
              <>
                Workout {workoutGoals.month} times this month
                {progressBar(monthlyCount, workoutGoals.month)}
              </>
            )}
          </li>
        </ul>
      </div>

      {/* nutrition goals */}
      <div className="card my-3">
        <div className="card-header">
          Nutrition Goals
          {editingNutrition ? (
            <button
              className="btn btn-sm btn-success float-end"
              onClick={() => setEditingNutrition(false)}
            >
              Save
            </button>
          ) : (
            <button
              className="btn btn-sm btn-outline-success float-end"
              onClick={() => setEditingNutrition(true)}
            >
              Edit
            </button>
          )}
        </div>
        <ul className="list-group list-group-flush">
          {Object.keys(nutritionGoals).map(key => {
            const label = key.charAt(0).toUpperCase() + key.slice(1)
            return (
              <li className="list-group-item" key={key}>
                {editingNutrition ? (
                  <>Daily {label} Goal: {' '}
                    <input
                      type="number"
                      value={nutritionGoals[key]}
                      onChange={e => setNutritionGoals({ ...nutritionGoals, [key]: Number(e.target.value) })}
                    />
                  </>
                ) : (
                  <>
                    Daily {label} Goal: {nutritionGoals[key]}
                    {progressBar(nutritionData[key], nutritionGoals[key])}
                  </>
                )}
              </li>
            )
          })}
        </ul>
      </div>

      {/* badges */}
      <div className="card my-3">
        <div className="card-header">Badges Earned</div>
        <ul className="list-group list-group-flush">
          {badgesEarned.length === 0 ? (
            <li className="list-group-item">No badges yet.</li>
          ) : (
            badgesEarned.map((badge, idx) => (
              <li className="list-group-item" key={idx}>{badge.type || badge}</li>
            ))
          )}
        </ul>
      </div>
    </div>
  )
}
