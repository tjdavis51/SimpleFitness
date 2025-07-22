import React, { useContext, useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../contexts/AuthContext'
import { logWorkout } from '../services/api'

// helper function to load the persisted workout goals
const loadWorkoutGoals = () => {
  try {
    const raw = localStorage.getItem('simplefitness-workout-goals')
    return raw ? JSON.parse(raw) : { week: 3, month: 12 }
  } catch {
    return { week: 3, month: 12 }
  }
}

// make the workout component
export default function Workout() {
  // get the logout function and the navigation object
  const { logout } = useContext(AuthContext)
  const navigate = useNavigate()

  // save the workout goals
  const workoutGoals = loadWorkoutGoals()

  // set the local states
  const [time, setTime] = useState(30)
  const [type, setType] = useState('Full Body')
  const [plan, setPlan] = useState([])
  const [savedPlans, setSavedPlans] = useState([])

  // load the saved plans
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('savedPlans') || '[]')
    setSavedPlans(stored)
  }, [])

  // generate a workout plan
  const generatePlan = () => {
    const exercises = {
      'Full Body': ['Push-ups', 'Squats', 'Plank', 'Jumping Jacks'],
      Arms: ['Bicep Curls', 'Tricep Dips', 'Push-ups', 'Shoulder Press'],
      Legs: ['Squats', 'Lunges', 'Calf Raises', 'Glute Bridges'],
      'Muscle Groups': ['Bench Press', 'Rows', 'Deadlifts', 'Pull-ups'],
      Cardio: ['Jump Rope', 'Running', 'Cycling', 'Burpees'],
      HIIT: ['Sprints', 'Jump Squats', 'Mountain Climbers', 'Burpees']
    }
    const selected = exercises[type] || exercises['Full Body']
    const perExerciseTime = Math.floor(time / selected.length)
    setPlan(selected.map(ex => ({ exercise: ex, duration: perExerciseTime })))
  }

  // save the plan locally
  const savePlan = () => {
    const updated = [...savedPlans, plan]
    setSavedPlans(updated)
    localStorage.setItem('savedPlans', JSON.stringify(updated))
    setPlan([])
  }

  // log the workout to the server and persist for the goals page
  const logPlan = async (loggedPlan) => {
    try {
      const res = await logWorkout({
        plan: loggedPlan,
        goals: workoutGoals
      })
      // persist locally so it can be viewed in goals
      const prev = JSON.parse(localStorage.getItem('simplefitness-completed-workouts') || '[]')
      const entry = { date: new Date().toISOString(), plan: loggedPlan }
      // save the prev and the enry
      localStorage.setItem(
        'simplefitness-completed-workouts',
        JSON.stringify([...prev, entry])
      )
      const earned = res.data.badges || []
      // make an alert to notify of a new badge being earned
      if (earned.length > 0) {
        alert('Workout logged! You earned: ' + earned.map(b => b.type).join(', '))
      } else {
        alert('Workout logged!')
      }
      // navigate the user back to the goals page for convience
      navigate('/goals')
    } catch (err) {
      console.error('Error logging workout:', err)
      alert('Failed to log workout.')
    }
  }

  // make the function to remove a saved workout plan
  const removePlan = (idx) => {
    const updated = savedPlans.filter((_, i) => i !== idx)
    setSavedPlans(updated)
    localStorage.setItem('savedPlans', JSON.stringify(updated))
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

      <h1>Workout</h1>

      {/* inputs */}
      <div className="card p-3 mb-3">
        <div className="row g-3">
          <div className="col-md-6">
            <label>Time to Workout (minutes)</label>
            <input
              type="number"
              className="form-control"
              value={time}
              onChange={e => setTime(Number(e.target.value))}
            />
          </div>
          <div className="col-md-6">
            <label>Workout Type</label>
            <select
              className="form-select"
              value={type}
              onChange={e => setType(e.target.value)}
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
        <button onClick={generatePlan} className="btn btn-success mt-3">
          Generate Plan
        </button>
      </div>

      {/* generated plan */}
      {plan.length > 0 && (
        <div className="card p-3 mb-3">
          <h5>Generated Plan</h5>
          <ul>
            {plan.map((item, idx) => (
              <li key={idx}>{item.exercise} — {item.duration} min</li>
            ))}
          </ul>
          <button onClick={savePlan} className="btn btn-success me-2">Save</button>
          <button onClick={() => logPlan(plan)} className="btn btn-warning">Log</button>
        </div>
      )}

      {/* saved plans */}
      {savedPlans.length > 0 && (
        <>
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
        </>
      )}

      <p className="mt-4">
        <em>Note: Logging will mark the workout plan as completed for the day and count towards your goal.</em>
      </p>
    </div>
  )
}