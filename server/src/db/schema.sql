CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS badges (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  type TEXT NOT NULL,
  awarded_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, type)
);

CREATE TABLE IF NOT EXISTS completed_workouts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  date    TIMESTAMP NOT NULL,
  plan    JSONB    NOT NULL
);

CREATE TABLE IF NOT EXISTS nutrition_logs (
  id       SERIAL PRIMARY KEY,
  user_id  INTEGER NOT NULL REFERENCES users(id),
  date     DATE    NOT NULL,
  calories INTEGER NOT NULL,
  macros   JSONB   NOT NULL,
  UNIQUE (user_id, date)
);