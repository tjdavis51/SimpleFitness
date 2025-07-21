import React, { useContext, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../contexts/AuthContext'

export default function Workout() {
  const { logout } = useContext(AuthContext)

  const [time, setTime] = useState(30)
  const [type, setType] = useState('Full Body')
  const [plan, setPlan] = useState([])
  const [savedPlans, setSavedPlans] = useState([])

  // Load saved plans from localStorage
  useEffect(() => {
    const storedPlans = JSON.parse(localStorage.getItem('savedPlans') || '[]')
    setSavedPlans(storedPlans)
  }, [])

  const generatePlan = () => {
    const exercises = {
      'Full Body': ['Push-ups', 'Squats', 'Plank', 'Jumping Jacks'],
      'Arms': ['Bicep Curls', 'Tricep Dips', 'Push-ups', 'Shoulder Press'],
      'Legs': ['Squats', 'Lunges', 'Calf Raises', 'Glute Bridges'],
      'Muscle Groups': ['Bench Press', 'Rows', 'Deadlifts', 'Pull-ups'],
      'Cardio': ['Jump Rope', 'Running', 'Cycling', 'Burpees'],
      'HIIT': ['Sprints', 'Jump Squats', 'Mountain Climbers', 'Burpees']
    }

    const selectedExercises = exercises[type] || exercises['Full Body']
    const perExerciseTime = Math.floor(time / selectedExercises.length)

    const generated = selectedExercises.map(ex => ({
      exercise: ex,
      duration: perExerciseTime
    }))

    setPlan(generated)
  }

  const savePlan = () => {
    const updated = [...savedPlans, plan]
    setSavedPlans(updated)
    localStorage.setItem('savedPlans', JSON.stringify(updated))
    setPlan([])
  }

  const logPlan = (loggedPlan) => {
    const workouts = JSON.parse(localStorage.getItem('completedWorkouts') || '[]')
    workouts.push({
      date: new Date().toISOString(),
      plan: loggedPlan
    })
    localStorage.setItem('completedWorkouts', JSON.stringify(workouts))
    alert('Workout logged! Counts toward your goal.')
  }

  const removePlan = (index) => {
    const updated = savedPlans.filter((_, i) => i !== index)
    setSavedPlans(updated)
    localStorage.setItem('savedPlans', JSON.stringify(updated))
  }

  return (
    <div className="container py-4">
      {/* Navbar */}
      <nav className="mb-4">
        <Link to="/dashboard" className="mx-2">Dashboard</Link>
        <Link to="/goals" className="mx-2">Goals</Link>
        <Link to="/videos" className="mx-2">Videos</Link>
        <Link to="/workout" className="mx-2">Workout</Link>
        <Link to="/nutrition" className="mx-2">Nutrition</Link>
        <button onClick={logout} className="btn btn-sm btn-outline-danger float-end">Sign Out</button>
      </nav>

      <h1>Workout</h1>

      {/* Inputs */}
      <div className="card p-3 mb-3">
        <div className="row g-3">
          <div className="col-md-6">
            <label>Time to Workout (minutes)</label>
            <input
              type="number"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="form-control"
            />
          </div>
          <div className="col-md-6">
            <label>Workout Type</label>
            <select
              className="form-select"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option>Full Body</option>
              <option>Arms</option>
              <option>Legs</option>
              <option>Muscle Groups</option>
              <option>Cardio</option>
              <option>HIIT</option>
            </select>
          </div>
        </div>

        <button onClick={generatePlan} className="btn btn-primary mt-3">
          Generate Plan
        </button>
      </div>

      {/* Generated Plan */}
      {plan.length > 0 && (
        <div className="card p-3 mb-3">
          <h5>Generated Plan</h5>
          <ul>
            {plan.map((item, idx) => (
              <li key={idx}>{item.exercise} — {item.duration} min</li>
            ))}
          </ul>
          <button onClick={savePlan} className="btn btn-success me-2">
            Save
          </button>
          <button onClick={() => logPlan(plan)} className="btn btn-warning">
            Log
          </button>
        </div>
      )}

      {/* Saved Plans */}
      <h4>My Saved Plans</h4>
      <div className="row">
        {savedPlans.map((saved, idx) => (
          <div className="col-md-4" key={idx}>
            <div className="card p-3 mb-3">
              <ul>
                {saved.map((item, i) => (
                  <li key={i}>{item.exercise} — {item.duration} min</li>
                ))}
              </ul>
              <button onClick={() => logPlan(saved)} className="btn btn-warning me-2">
                Log
              </button>
              <button onClick={() => removePlan(idx)} className="btn btn-danger">
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-4">
        <em>Note: Logging will mark the workout plan as completed for the day and count towards the goal.</em>
      </p>
    </div>
  )
}
