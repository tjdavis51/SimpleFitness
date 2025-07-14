// get the use state and context
import React, { useState, useContext } from 'react'
// get the navigater
import { useNavigate } from 'react-router-dom'
// get the signin helper from the api
import { signIn } from '../services/api'
// get the auth context object
import { AuthContext } from '../contexts/AuthContext'

// start the signin component
export default function SignIn() {
  // first get the login from the current context
  const { login } = useContext(AuthContext)
  // and make a navigate object for navigation
  const navigate = useNavigate()
  // set the states for the form with email and password
  const [form, setForm] = useState({ email: '', password: '' })
  // set the error state as well
  const [err, setErr] = useState('')

  // this hanldes the change from the event for the form
  // first make the handle change helper
  const handleChange = e =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  // start the handle submit helper
  const handleSubmit = async e => {
    // prevent the default loading
    e.preventDefault()
    // try to sign the user in and navigate to the dashboard
    try {
      const { data } = await signIn(form)
      login(data.user)
      navigate('/dashboard')
      // otherwise catch the error and display the error message
    } catch (e) {
      setErr(e.response?.data?.message || 'Signin failed')
    }
  }

  return (
    // use a small style along with the bootstrap so that the maxwidth is bounded
    <div className="container py-5" style={{ maxWidth: 400 }}>
      {/* use the bootstrap success color and diplay the welcome message */}
      <h2 className="mb-4 text-success">Welcome Back</h2>
      {/* handle the error styling using bootstrap */}
      {err && <div className="alert alert-danger">{err}</div>}
      {/* start the form to get the email */}
      {/* use the handle submit helper when the submission is sent */}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Email</label>
          {/* collect the email as an email type using the hande chnage helper */}
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
          {/* then get the password, setting the type to password, and using the handle change function */}
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
        {/* set the sign in button, again using the success color */}
        <button type="submit" className="btn btn-success w-100">
          Sign In
        </button>
      </form>
    </div>
  )
}