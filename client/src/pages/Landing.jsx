import React from 'react'
import { Link } from 'react-router-dom'

// export the component for the landing page
export default function Landing() {
  return (
    <div className="container text-center py-5">
      {/* give the opening message */}
      <h1 className="mb-4 text-success">Welcome to SimpleFitness</h1>
      {/* give the value proposition */}
      <p className="lead mb-4">
        Track your goals, workouts and nutrition all in one place.
      </p>
      {/* link to the signup page */}
      <Link to="/signup" className="btn btn-success btn-lg mx-2">
        Get Started
      </Link>
      {/* link to the signin page */}
      <Link to="/signin" className="btn btn-outline-success btn-lg mx-2">
        Sign In
      </Link>
    </div>
  )
}