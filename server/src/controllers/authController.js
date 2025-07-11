import bcrypt from 'bcrypt'
import { query } from '../db/index.js'

export async function signUp(req, res, next) {
  try {
    const { name, email, password } = req.body
    // hash the password
    const hash = await bcrypt.hash(password, 10)
    // insert user and get back their id, name, and email
    const { rows } = await query(
      `INSERT INTO users (name, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, name, email`,
      [name, email, hash]
    )
    const user = rows[0]
    // store their id in session
    req.session.userId = user.id
    // return the new user object
    res.json({ user })
  } catch (err) {
    // handle unique email violation
    if (err.code === '23505') {
      return res.status(400).json({ message: 'Email already in use' })
    }
    next(err)
  }
}

export async function signIn(req, res, next) {
  try {
    const { email, password } = req.body
    // look up the user by email
    const { rows } = await query(
      `SELECT id, name, email, password_hash
       FROM users
       WHERE email = $1`,
      [email]
    )
    const user = rows[0]
    // if no user or bad password then unauthorized
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }
    // store their id in session
    req.session.userId = user.id
    // return a user object
    res.json({ user: { id: user.id, name: user.name, email: user.email } })
  } catch (err) {
    next(err)
  }
}

export function signOut(req, res) {
  // destroy the express session and clear their cookie
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ message: 'Logout failed' })
    }
    res.clearCookie('sid')
    res.json({ message: 'Logged out' })
  })
}

export async function fetchMe(req, res, next) {
  try {
    // fetch the current user from their session id
    const { rows } = await query(
      `SELECT id, name, email
       FROM users
       WHERE id = $1`,
      [req.session.userId]
    )
    res.json({ user: rows[0] })
  } catch (err) {
    next(err)
  }
}