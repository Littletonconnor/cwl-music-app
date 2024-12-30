import Database from 'better-sqlite3'
import dotenv from 'dotenv'
import { drizzle } from 'drizzle-orm/better-sqlite3'

import * as schema from './schema'

dotenv.config()

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set.')
}

const client = new Database(process.env.DATABASE_URL)
export const db = drizzle(client, { schema })
