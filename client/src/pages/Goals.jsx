import React, { useContext, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../contexts/AuthContext'

export default function Goals() {
  const { logout } = useContext(AuthContext)

  const [workoutGoals, setWorkoutGoals] = useState({ week: 3, month: 12 })
  const [nutritionGoals, setNutritionGoals] = useState({ calories: 2000, carbs: 250, protein: 150, fat: 70 })
  const [editingWorkout, setEditingWorkout] = useState(false)
  const [editingNutrition, setEditingNutrition] = useState(false)

  const [completedWorkouts, setCompletedWorkouts] = useState([])
  const [badgesEarned, setBadgesEarned] = useState([])

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('completedWorkouts') || '[]')
    setCompletedWorkouts(stored)
  }, [])

  useEffect(() => {
    localStorage.setItem('completedWorkouts', JSON.stringify(completedWorkouts))
    checkForBadges()
  }, [completedWorkouts])

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

  const weeklyCount = completedWorkouts.filter(d => new Date(d.date) >= startOfWeek()).length
  const monthlyCount = completedWorkouts.filter(d => new Date(d.date) >= startOfMonth()).length

  const checkForBadges = () => {
    const earned = []
    if (weeklyCount >= workoutGoals.week) earned.push('🏅 Weekly Goal Met')
    if (monthlyCount >= workoutGoals.month) earned.push('🏆 Monthly Goal Met')
    setBadgesEarned(earned)
  }

  const progressBar = (value, max) => {
    const pct = Math.min((value / max) * 100, 100)
    return (
      <div className="progress">
        <div className="progress-bar" style={{ width: `${pct}%` }}>
          {value}/{max}
        </div>
      </div>
    )
  }

  return (
    <div className="container py-4">
      <nav className="mb-4">
        <Link to="/dashboard" className="mx-2">Dashboard</Link>
        <Link to="/goals" className="mx-2">Goals</Link>
        <Link to="/videos" className="mx-2">Videos</Link>
        <Link to="/workout" className="mx-2">Workout</Link>
        <Link to="/nutrition" className="mx-2">Nutrition</Link>
        <button onClick={logout} className="btn btn-sm btn-outline-danger float-end">Sign Out</button>
      </nav>

      <h1>Goals</h1>

      {/* workout goals */}
      <div className="card my-3">
        <div className="card-header">
          Workout Goals
          {editingWorkout ? (
            <button className="btn btn-sm btn-success float-end" onClick={() => setEditingWorkout(false)}>Save</button>
          ) : (
            <button className="btn btn-sm btn-outline-primary float-end" onClick={() => setEditingWorkout(true)}>Edit</button>
          )}
        </div>
        <ul className="list-group list-group-flush">
          <li className="list-group-item">
            {editingWorkout ? (
              <>
                Workout <input type="number" value={workoutGoals.week} onChange={e => setWorkoutGoals({ ...workoutGoals, week: e.target.value })} /> times this week
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
              <>
                Workout <input type="number" value={workoutGoals.month} onChange={e => setWorkoutGoals({ ...workoutGoals, month: e.target.value })} /> times this month
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
            <button className="btn btn-sm btn-success float-end" onClick={() => setEditingNutrition(false)}>Save</button>
          ) : (
            <button className="btn btn-sm btn-outline-primary float-end" onClick={() => setEditingNutrition(true)}>Edit</button>
          )}
        </div>
        <ul className="list-group list-group-flush">
          {Object.keys(nutritionGoals).map(key => (
            <li className="list-group-item" key={key}>
              {editingNutrition ? (
                <>
                  Daily {key.charAt(0).toUpperCase() + key.slice(1)}: <input type="number" value={nutritionGoals[key]} onChange={e => setNutritionGoals({ ...nutritionGoals, [key]: e.target.value })} />
                </>
              ) : (
                <>Daily {key.charAt(0).toUpperCase() + key.slice(1)}: {nutritionGoals[key]}</>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* badges earned */}
      <div className="card my-3">
        <div className="card-header">Badges Earned</div>
        <ul className="list-group list-group-flush">
          {badgesEarned.length === 0 && <li className="list-group-item">No badges yet.</li>}
          {badgesEarned.map((badge, idx) => (
            <li className="list-group-item" key={idx}>{badge}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
