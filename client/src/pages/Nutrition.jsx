import React, { useContext, useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../contexts/AuthContext'
import { saveNutrition } from '../services/api'

export default function Nutrition() {
  // get the logout function
  const { logout } = useContext(AuthContext)
  const navigate = useNavigate()
  // get the date of today
  const today = new Date().toISOString().slice(0, 10)

  // match the same key Goals.jsx reads
  // the key is used to store everything on the local storge
  // it needs to to act as the key value pair to find the data
  const STORAGE_KEY = 'simplefitness-nutrition'

  // set the state locally for today's nutrition
  const [calories, setCalories] = useState(0)
  const [macros, setMacros] = useState({ carbs: 0, protein: 0, fat: 0 })
  const [mealInput, setMealInput] = useState(0)
  const [macroInputs, setMacroInputs] = useState({ carbs: 0, protein: 0, fat: 0 })

  // load the saved nutrition
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      try {
        const saved = JSON.parse(raw)
        if (saved.date === today) {
          setCalories(saved.calories)
          setMacros(saved.macros)
        }
      } catch (err) {
        console.warn('Failed to parse nutrition from localStorage', err)
      }
    }
  }, [today])

  // helper to persist the daily nutrition locally
  const persistLocal = (newCalories, newMacros) => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ date: today, calories: newCalories, macros: newMacros })
    )
  }

  // make a save for the data
  const handleSave = async (newCalories, newMacros) => {
    try {
      const res = await saveNutrition({
        date: today,
        calories: newCalories,
        macros: newMacros
      })
      // save the local data
      persistLocal(newCalories, newMacros)

      const badges = res.data.badges || []
      // give an alert if a badge was earned
      if (badges.length) {
        alert('Nutrition saved! You earned: ' + badges.map(b => b.type).join(', '))
      } else {
        alert('Nutrition saved!')
      }
      // send the user to the goals page for convience
      navigate('/goals')
    } catch (err) {
      console.error('Failed to save nutrition', err)
      alert('Failed to log nutrition')
    }
  }

  // function for logging calories
  const logMeal = () => {
    const updatedCalories = calories + Number(mealInput)
    handleSave(updatedCalories, macros)
    setMealInput(0)
  }

  // function for logging a macro
  const logMacro = (type) => {
    const updatedMacros = {
      ...macros,
      [type]: macros[type] + Number(macroInputs[type])
    }
    handleSave(calories, updatedMacros)
    setMacroInputs({ ...macroInputs, [type]: 0 })
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

      <h1>Nutrition</h1>

      {/* calories */}
      <div className="card p-3 mb-3">
        <h5>Today's Calories</h5>
        <p><strong>{calories}</strong> kcal</p>
        <div className="input-group">
          <input
            type="number"
            className="form-control"
            value={mealInput}
            onChange={e => setMealInput(e.target.value)}
            placeholder="Add Meal Calories"
          />
          <button onClick={logMeal} className="btn btn-success">
            Log Meal
          </button>
        </div>
      </div>

      {/* macros */}
      <div className="row">
        {['carbs', 'protein', 'fat'].map(macro => (
          <div className="col-md-4" key={macro}>
            <div className="card p-3 mb-3">
              <h5>{macro.charAt(0).toUpperCase() + macro.slice(1)}</h5>
              <p><strong>{macros[macro]}</strong> g</p>
              <div className="input-group">
                <input
                  type="number"
                  className="form-control"
                  value={macroInputs[macro]}
                  onChange={e => setMacroInputs({ ...macroInputs, [macro]: e.target.value })}
                  placeholder={`Add ${macro}`}
                />
                <button
                  onClick={() => logMacro(macro)}
                  className="btn btn-success"
                >
                  Log
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}