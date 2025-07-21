import express from 'express'
import session from 'express-session'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/authRoutes.js'
import dashboardRoutes from './routes/dashboardRoutes.js'
import { requireAuth } from './middleware/authMiddleware.js'

// access the .env file
dotenv.config()

// start an express app
const app = express()

// set the host address
app.use(cors({
  origin: 'http://localhost:5174',
  credentials: true
}))

// configure the app
app.use(express.json())

// configure the express session
app.use(session({
  name: 'sid',
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    // make the session end after 1 day because its in miliseconds
    maxAge: 1000 * 60 * 60 * 24
  }
}))

// public auth endpoint
app.use('/api/auth', authRoutes)

// protected dashboard api
app.use('/api/dashboard', requireAuth, dashboardRoutes)

// start the server
app.listen(process.env.PORT, () =>
  console.log(`Server listening on port ${process.env.PORT}`)
)