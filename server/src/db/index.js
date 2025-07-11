import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { Client } from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname  = path.dirname(__filename)

//  make constant the database variables
const {
  DB_USER,
  DB_PASSWORD,
  DB_HOST,
  DB_NAME,
  DB_PORT,
  NODE_ENV
} = process.env


export async function query(text, params) {
  const client = new Client({
    user: DB_USER,
    password: DB_PASSWORD,
    host: DB_HOST,
    database: DB_NAME,
    port: Number(DB_PORT)
  })

  await client.connect()
  try {
    return await client.query(text, params)
  } finally {
    await client.end()
  }
}

// in development auto run schema resets
if (NODE_ENV !== 'production') {
  ;(async () => {
    const filePath = path.join(__dirname, 'schema.sql')
    const sql = fs.readFileSync(filePath, 'utf8')
    try {
      await query(sql)
      console.log('Dev database reset')
    } catch (err) {
      console.error('Schema reset error', err)
    }
  })()
}
