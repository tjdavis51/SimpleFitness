import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { Client } from 'pg'
import dotenv from 'dotenv'

// set up the .env file access
dotenv.config()

// delcare the variables for the file and directory
const __filename = fileURLToPath(import.meta.url)
const __dirname  = path.dirname(__filename)

// make constant the database variables from the .env file
const {
  DB_USER,
  DB_PASSWORD,
  DB_HOST,
  DB_NAME,
  DB_PORT,
  NODE_ENV
} = process.env

// make a query function which will access the database and take the arguments for each query
export async function query(text, params) {
  const client = new Client({
    user: DB_USER,
    password: DB_PASSWORD,
    host: DB_HOST,
    database: DB_NAME,
    port: Number(DB_PORT)
  })

  // connect to the database
  await client.connect()
  // try to query for the requested information
  try {
    return await client.query(text, params)
  } finally {
    // close the connection
    await client.end()
  }
}

// in development auto run the schema resets
if (NODE_ENV !== 'production') {
  ;(async () => {
    // first access the sql file with the schema
    const filePath = path.join(__dirname, 'schema.sql')
    // then extract the queries and save them
    const sql = fs.readFileSync(filePath, 'utf8')
    try {
      // try to run them using the query function
      await query(sql)
      // if it ran then log the database reset
      console.log('Dev database reset')
    } catch (err) {
      // otherwise show that an error occured
      console.error('Schema reset error', err)
    }
  })()
}
