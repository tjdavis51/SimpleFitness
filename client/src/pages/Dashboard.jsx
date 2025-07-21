import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../contexts/AuthContext'

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext)

  const [welcomeMsg, setWelcomeMsg] = useState('')
  const [latestWorkout, setLatestWorkout] = useState(null)

  useEffect(() => {
    setWelcomeMsg('Welcome to your dashboard! Stay motivated!')

    const workouts = JSON.parse(localStorage.getItem('completedWorkouts') || '[]')
    if (workouts.length > 0) {
      const lastWorkout = workouts[workouts.length - 1]
      setLatestWorkout(lastWorkout.plan || null)
    }
  }, [])

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

      <h1>Hello, {user?.name || 'Guest'}</h1>
      <p>{welcomeMsg}</p>

      {/* Latest Workout */}
      <div className="card my-3">
        <div className="card-header">
          <strong>Latest Logged Workout</strong>
          <Link to="/workout" className="btn btn-sm btn-primary float-end">
            View All
          </Link>
        </div>
        <div className="card-body">
          {latestWorkout ? (
            <ul>
              {latestWorkout.map((item, idx) => (
                <li key={idx}>{item.exercise} — {item.duration} min</li>
              ))}
            </ul>
          ) : (
            <p>No workouts logged yet. Start one on the <Link to="/workout">Workout Page</Link>.</p>
          )}
        </div>
      </div>

      {/* Other Sections */}
      <div className="row">
        <div className="col-md-6">
          <div className="card mb-3">
            <div className="card-header">Current Goals</div>
            <div className="card-body">
              <Link to="/goals">View your goals here</Link>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card mb-3">
            <div className="card-header">Today’s Nutrition</div>
            <div className="card-body">
              <Link to="/nutrition">Track your nutrition here</Link>
            </div>
          </div>
        </div>

        <div className="col-md-12">
          <div className="card mb-3">
            <div className="card-header">Keep Watching</div>
            <div className="card-body">
              <Link to="/videos">Continue watching your videos here</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}