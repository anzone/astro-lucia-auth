import { DrizzleSQLiteAdapter } from '@lucia-auth/adapter-drizzle'
import sqlite from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import { sessionTable, userTable } from './models'

const sqliteDB = sqlite('auth.db')
const db = drizzle(sqliteDB)

export const dbAdapter = new DrizzleSQLiteAdapter(db, sessionTable, userTable)