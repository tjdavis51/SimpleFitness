import React, { useContext, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../contexts/AuthContext'

export default function Nutrition() {
  const { logout } = useContext(AuthContext)

  const today = new Date().toISOString().slice(0, 10)

  const [calories, setCalories] = useState(0)
  const [mealInput, setMealInput] = useState(0)

  const [macros, setMacros] = useState({
    carbs: 0,
    protein: 0,
    fat: 0,
  })
  const [macroInputs, setMacroInputs] = useState({
    carbs: 0,
    protein: 0,
    fat: 0,
  })

  // load today's nutrition from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('nutrition') || '{}')
    if (saved.date === today) {
      setCalories(saved.calories)
      setMacros(saved.macros)
    } else {
      setCalories(0)
      setMacros({ carbs: 0, protein: 0, fat: 0 })
    }
  }, [])

  const saveNutrition = (newCalories, newMacros) => {
    setCalories(newCalories)
    setMacros(newMacros)
    localStorage.setItem(
      'nutrition',
      JSON.stringify({ date: today, calories: newCalories, macros: newMacros })
    )
  }

  const logMeal = () => {
    const updatedCalories = calories + Number(mealInput)
    saveNutrition(updatedCalories, macros)
    setMealInput(0)
  }

  const logMacro = (type) => {
    const updated = {
      ...macros,
      [type]: macros[type] + Number(macroInputs[type]),
    }
    saveNutrition(calories, updated)
    setMacroInputs({ ...macroInputs, [type]: 0 })
  }

  return (
    <div className="container py-4">
      {/* navbar */}
      <nav className="mb-4">
        <Link to="/dashboard" className="mx-2">Dashboard</Link>
        <Link to="/goals" className="mx-2">Goals</Link>
        <Link to="/videos" className="mx-2">Videos</Link>
        <Link to="/workout" className="mx-2">Workout</Link>
        <Link to="/nutrition" className="mx-2">Nutrition</Link>
        <button onClick={logout} className="btn btn-sm btn-outline-danger float-end">Sign Out</button>
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
            onChange={(e) => setMealInput(e.target.value)}
            placeholder="Add Meal Calories"
          />
          <button onClick={logMeal} className="btn btn-success">
            Log
          </button>
        </div>
      </div>

      {/* macros */}
      <div className="row">
        {['carbs', 'protein', 'fat'].map((macro) => (
          <div className="col-md-4" key={macro}>
            <div className="card p-3 mb-3">
              <h5>{macro.charAt(0).toUpperCase() + macro.slice(1)}</h5>
              <p><strong>{macros[macro]}</strong> grams</p>
              <div className="input-group">
                <input
                  type="number"
                  className="form-control"
                  value={macroInputs[macro]}
                  onChange={(e) =>
                    setMacroInputs({ ...macroInputs, [macro]: e.target.value })
                  }
                  placeholder={`Add ${macro}`}
                />
                <button onClick={() => logMacro(macro)} className="btn btn-success">
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
