import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { signIn } from '../services/api'
import { AuthContext } from '../contexts/AuthContext'

export default function SignIn() {
  const { login } = useContext(AuthContext)
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [err, setErr] = useState('')

  const handleChange = e =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      const { data } = await signIn(form)
      login(data.user)
      navigate('/dashboard')
    } catch (e) {
      setErr(e.response?.data?.message || 'Signin failed')
    }
  }

  return (
    <div className="container py-5" style={{ maxWidth: 400 }}>
      <h2 className="mb-4 text-success">Welcome Back</h2>
      {err && <div className="alert alert-danger">{err}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="mb-4">
          <label className="form-label">Password</label>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <button type="submit" className="btn btn-success w-100">
          Sign In
        </button>
      </form>
    </div>
  )
}