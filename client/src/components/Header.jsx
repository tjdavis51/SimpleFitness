import React from 'react'
import { Link } from 'react-router-dom'

// function to the header for each page
export default function Header() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-success">
      <div className="container">
        {/* making the logo text a link to the landing page */}
        <Link className="navbar-brand" to="/">SimpleFitness</Link>
        {/* configure the nav menu collapsable for small screens */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navMenu"
        >
          {/* add the hamburger icon for small screens to toggle the nav menu */}
          <span className="navbar-toggler-icon" />
        </button>

        {/* set the navigation bar */}
        <div className="collapse navbar-collapse" id="navMenu">
          {/* start the list of items in the bar */}
          <ul className="navbar-nav ms-auto">
            {/* make a link to the signin page */}
            <li className="nav-item">
              <Link className="nav-link" to="/signin">Sign In</Link>
            </li>
            {/* make a link to the signup page */}
            <li className="nav-item">
              <Link className="btn btn-outline-light ms-2" to="/signup">
                Sign Up
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}