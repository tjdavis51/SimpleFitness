import React, { useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { Link } from 'react-router-dom'

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext)

  return (
    <div className="container py-4">

      {/* nav bar */}
      <nav className="mb-4">
        <Link to="/dashboard" className="mx-2">Dashboard</Link>
        <Link to="/goals" className="mx-2">Goals</Link>
        <Link to="/videos" className="mx-2">Videos</Link>
        <Link to="/workout" className="mx-2">Workout</Link>
        <Link to="/nutrition" className="mx-2">Nutrition</Link>
        <button onClick={logout} className="btn btn-sm btn-outline-danger float-end">Sign Out</button>
      </nav>

      {/* greeting and title */}
      <h2>Hello, {user?.name || 'User'}</h2>
      <h1>Dashboard</h1>

      {/* sections */}
      <div className="row mt-4">

        {/* current goals */}
        <div className="col-md-6 mb-3">
          <div className="card">
            <div className="card-header">
              Current Goals <Link to="/goals" className="float-end">Go to Goals</Link>
            </div>
            <ul className="list-group list-group-flush">
              <li className="list-group-item">Goal 1</li>
              <li className="list-group-item">Goal 2</li>
              <li className="list-group-item">Goal 3</li>
            </ul>
          </div>
        </div>

        {/* recent badges */}
        <div className="col-md-6 mb-3">
          <div className="card">
            <div className="card-header">
              Recent Badges <Link to="/badges" className="float-end">View Badges</Link>
            </div>
            <ul className="list-group list-group-flush">
              <li className="list-group-item">🏅 Badge 1</li>
              <li className="list-group-item">🏅 Badge 2</li>
              <li className="list-group-item">🏅 Badge 3</li>
            </ul>
          </div>
        </div>

      </div>

      <div className="row">

        {/* today's nutrition */}
        <div className="col-md-6 mb-3">
          <div className="card">
            <div className="card-header">
              Today's Nutrition <Link to="/nutrition" className="float-end">Go to Nutrition</Link>
            </div>
            <ul className="list-group list-group-flush">
              <li className="list-group-item">Calories: 2000 kcal</li>
              <li className="list-group-item">Protein: 100g</li>
              <li className="list-group-item">Fat: 50g</li>
            </ul>
          </div>
        </div>

        {/* today's workout */}
        <div className="col-md-6 mb-3">
          <div className="card">
            <div className="card-header">
              Today's Workout <Link to="/workout" className="float-end">Go to Workout</Link>
            </div>
            <ul className="list-group list-group-flush">
              <li className="list-group-item">Exercise 1</li>
              <li className="list-group-item">Exercise 2</li>
              <li className="list-group-item">Exercise 3</li>
            </ul>
          </div>
        </div>

      </div>

      <div className="row">

        {/* keep watching */}
        <div className="col-md-6 mb-3">
          <div className="card">
            <div className="card-header">
              Keep Watching <Link to="/videos" className="float-end">Go to Videos</Link>
            </div>
            <ul className="list-group list-group-flush">
              <li className="list-group-item">Last Video Title</li>
            </ul>
          </div>
        </div>

      </div>

    </div>
  )
}
