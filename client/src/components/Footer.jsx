import React from 'react'

// function for the footer
export default function Footer() {
  return (
    <footer className="bg-light text-center py-3 mt-auto">
      <div className="container">
        <small className="text-muted">
          {/* create a date object and read the current year */}
          Copyright {new Date().getFullYear()} SimpleFitness
        </small>
      </div>
    </footer>
  )
}