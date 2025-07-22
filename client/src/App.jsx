import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Landing from './pages/Landing'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import Dashboard from './pages/Dashboard'
import Goals from './pages/Goals'
import Workout from './pages/Workout'
import Nutrition from './pages/Nutrition'
import Videos from './pages/Videos'
import ProtectedRoute from './components/ProtectedRoute'

// start the app component which will render the entire app
export default function App() {
  return (
    // apply some global bootstrap styles
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <main className="flex-grow-1">
        {/* declare all the routes */}
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />

          {/* these are the protected routes */}
          {/* to the dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* to the goals page */}
          <Route
            path="/goals"
            element={
              <ProtectedRoute>
                <Goals />
              </ProtectedRoute>
            }
          />

          {/* top the workout page */}
          <Route
            path="/workout"
            element={
              <ProtectedRoute>
                <Workout />
              </ProtectedRoute>
            }
          />

          {/* to the nutrition page */}
          <Route
            path="/nutrition"
            element={
              <ProtectedRoute>
                <Nutrition />
              </ProtectedRoute>
            }
          />

          {/* to the videos page */}
          <Route
            path="/videos"
            element={
              <ProtectedRoute>
                <Videos />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}