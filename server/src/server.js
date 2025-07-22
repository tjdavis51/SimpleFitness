import express from 'express'
import session from 'express-session'
import cors from 'cors'
import dotenv from 'dotenv'
import nutritionRoutes  from './routes/nutritionRoutes.js'
import authRoutes       from './routes/authRoutes.js'
import dashboardRoutes  from './routes/dashboardRoutes.js'
import badgeRoutes      from './routes/badgeRoutes.js'
import workoutRoutes    from './routes/workoutRoutes.js'
import { requireAuth }  from './middleware/authMiddleware.js'

// access the .env file
dotenv.config()

// define the express app
const app = express()

// set the host address
app.use(cors({ origin: 'http://localhost:5174', credentials: true }))

// configure for json
app.use(express.json())

// configure the express session
app.use(
  session({
    name: 'sid',
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    // set the session to last for 1 day
    cookie: { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 }
  })
)

// public route
app.use('/api/auth', authRoutes)

// protected routes
app.use('/api/dashboard', requireAuth, dashboardRoutes)
app.use('/api/badges'   , requireAuth, badgeRoutes)
app.use('/api/workout'  , requireAuth, workoutRoutes)
app.use('/api/nutrition', requireAuth, nutritionRoutes)

// set the port number
const PORT = process.env.PORT || 5000

// start the server
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`))