import React, { useEffect, useState, useContext } from 'react'
import { getDash } from '../services/api'
import { AuthContext } from '../contexts/AuthContext'

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    getDash()
      .then(res => setMsg(res.data.message))
      .catch(() => setMsg('Error loading dashboard'))
  }, [])

  return (
    <div className="container py-5">
      <h1 className="text-success">Hello, {user.name}</h1>
      <p>{msg}</p>
      <button className="btn btn-outline-danger" onClick={logout}>
        Sign Out
      </button>
    </div>
  )
}