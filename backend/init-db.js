/**
 * Database provisioning script.
 * Creates the schema and seeds runtime data on FIRST run only.
 * Idempotent: if the packages table already exists with data, it skips.
 * Intended for Railway / fresh environments.
 * Usage: node backend/init-db.js   (from repo root or backend dir)
 */
import mysql from 'mysql2/promise'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const host = process.env.DB_HOST || 'localhost'
const port = Number(process.env.DB_PORT || 3306)
const user = process.env.DB_USER || 'root'
const password = process.env.DB_PASSWORD || ''
const database = process.env.DB_NAME || 'sa_tertiary_db'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const schemaFile = path.join(__dirname, 'Database', 'sa_tertiary_db.sql')
const seedFile = path.join(__dirname, 'Database', 'seed-runtime.sql')

async function main() {
  const conn = await mysql.createConnection({ host, port, user, password, multipleStatements: true })

  const [[tables]] = await conn.query(
    `SELECT COUNT(*) AS c FROM information_schema.tables WHERE table_schema = ? AND table_name = 'packages'`,
    [database]
  )

  if (Number(tables.c) > 0) {
    const [[pkg]] = await conn.query(`SELECT COUNT(*) AS c FROM \`${database}\`.packages`)
    if (Number(pkg.c) > 0) {
      console.log('Database already provisioned — skipping init.')
      await conn.end()
      process.exit(0)
    }
  }

  console.log(`Provisioning database ${database}...`)
  const schemaSql = fs.readFileSync(schemaFile, 'utf8')
  await conn.query(schemaSql)

  const seedSqlRaw = fs.readFileSync(seedFile, 'utf8')
  const seedSql = seedSqlRaw.replace(/^USE .*;\s*/m, '')
  await conn.query(seedSql)

  await conn.end()
  console.log('Database provisioned successfully.')
  process.exit(0)
}

main().catch((err) => {
  console.error('Database provisioning failed:', err)
  process.exit(1)
})