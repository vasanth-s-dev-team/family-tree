import pg from "pg"
import path from "path"
import fs from "fs"

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"


// Manual .env.local loader to avoid dependencies
const envPath = path.resolve(process.cwd(), ".env.local")
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf8")
  envContent.split(/\r?\n/).forEach(line => {
    if (line.trim().startsWith("#") || !line.includes("=")) return
    const [key, ...valueParts] = line.split("=")
    const trimmedKey = key.trim()
    let value = valueParts.join("=").trim()
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1)
    }
    process.env[trimmedKey] = value
  })
}

// Use non-pooling connection string for migrations/DDL
const connectionString = process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL

if (!connectionString) {
  console.error("Error: Connection string (POSTGRES_URL_NON_POOLING or POSTGRES_URL) not found in .env.local")
  process.exit(1)
}

const sqlPath = path.resolve(process.cwd(), "scripts/create-tables.sql")
if (!fs.existsSync(sqlPath)) {
  console.error(`Error: SQL script not found at ${sqlPath}`)
  process.exit(1)
}

const sqlContent = fs.readFileSync(sqlPath, "utf8")

const client = new pg.Client({
  connectionString: connectionString,
  ssl: {
    rejectUnauthorized: false // Required for Supabase connections over SSL
  }
})

async function runMigration() {
  console.log("Connecting to Supabase PostgreSQL...")
  try {
    await client.connect()
    console.log("Connected successfully. Running SQL migrations...")

    // Execute the SQL schema setup
    await client.query(sqlContent)

    console.log("✓ SQL migrations completed successfully! All tables, indexes, and RLS policies created.")
  } catch (err) {
    console.error("Migration failed:", err)
  } finally {
    await client.end()
  }
}

runMigration()
