import express from 'express'
import session from 'express-session'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/authRoutes.js'
import dashboardRoutes from './routes/dashboardRoutes.js'
import { requireAuth } from './middleware/authMiddleware.js'

dotenv.config()
const app = express()

app.use(cors({
  origin: 'http://localhost:5174',
  credentials: true
}))
app.use(express.json())

app.use(session({
  name: 'sid',
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24
  }
}))

// public auth
app.use('/api/auth', authRoutes)

// protected dashboard API
app.use('/api/dashboard', requireAuth, dashboardRoutes)

app.listen(process.env.PORT, () =>
  console.log(`Server listening on port ${process.env.PORT}`)
)