// get the state and context from react
import React, { useState, useContext } from 'react'
// get the navigator
import { useNavigate } from 'react-router-dom'
// get the signup function from the api
import { signUp } from '../services/api'
// import the auth context
import { AuthContext } from '../contexts/AuthContext'

// start the signup component
export default function SignUp() {
  // get the login from the context
  const { login } = useContext(AuthContext)
  // start a navigation object
  const navigate = useNavigate()
  // use the state to configure the form
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  // and configure the error
  const [err, setErr] = useState('')

  // make a handle change helper
  const handleChange = e =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  // make a handle submit helper
  const handleSubmit = async e => {
    // first prevent the default loading
    e.preventDefault()
    // try to sign the user up first and navigate them to the dashboard
    try {
      const { data } = await signUp(form)
      login(data.user)
      navigate('/dashboard')
      // otherwise send the user the sign up error
    } catch (e) {
      setErr(e.response?.data?.message || 'Signup failed')
    }
  }

  return (
    // set the max width for the container
    <div className="container py-5" style={{ maxWidth: 400 }}>
       {/* use the bootstrap success color for the text */}
      <h2 className="mb-4 text-success">Create an Account</h2>
      {/* set the style for the error message */}
      {err && <div className="alert alert-danger">{err}</div>}
      {/* on submission, send to the handleSubmit helper function and start the from */}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Name</label>
          {/* collect the name and use the handle change helper */}
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          {/* collect the email and set the type to email, handle changes using the helper */}
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
          {/* get the password, use the handle change helper again */}
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
        {/* make a submit button to handle the submission using the success color again */}
        <button type="submit" className="btn btn-success w-100">
          Sign Up
        </button>
      </form>
    </div>
  )
}