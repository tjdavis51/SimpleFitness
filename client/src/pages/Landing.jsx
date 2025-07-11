import React from 'react'
import { Link } from 'react-router-dom'

export default function Landing() {
  return (
    <div className="container text-center py-5">
      <h1 className="mb-4 text-success">Welcome to SimpleFitness</h1>
      <p className="lead mb-4">
        Track your goals, workouts and nutrition all in one place.
      </p>
      <Link to="/signup" className="btn btn-success btn-lg mx-2">
        Get Started
      </Link>
      <Link to="/signin" className="btn btn-outline-success btn-lg mx-2">
        Sign In
      </Link>
    </div>
  )
}