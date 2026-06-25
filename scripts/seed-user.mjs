import { createClient } from "@supabase/supabase-js"
import path from "path"
import fs from "fs"

// Manual .env.local loader to avoid dependencies
const envPath = path.resolve(process.cwd(), ".env.local")
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf8")
  envContent.split(/\r?\n/).forEach(line => {
    // Skip comments and empty lines
    if (line.trim().startsWith("#") || !line.includes("=")) return
    
    const [key, ...valueParts] = line.split("=")
    const trimmedKey = key.trim()
    let value = valueParts.join("=").trim()
    
    // Strip quotes if they exist
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1)
    }
    
    process.env[trimmedKey] = value
  })
}

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function seed() {
  const email = "demo@familytree.com"
  const password = "DemoPassword123!"

  console.log(`Seeding user: ${email}`)

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true
  })

  if (error) {
    if (error.message.includes("already registered") || error.message.includes("Conflict")) {
      console.log("User already exists. Attempting to update password instead...")
      
      // Let's find the user first
      const { data: usersData, error: listError } = await supabase.auth.admin.listUsers()
      if (listError) {
        console.error("Failed to list users:", listError.message)
        process.exit(1)
      }
      
      const user = usersData.users.find(u => u.email === email)
      if (user) {
        const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
          password,
          email_confirm: true
        })
        if (updateError) {
          console.error("Failed to update user password:", updateError.message)
          process.exit(1)
        }
        console.log("Password updated successfully for existing user!")
      } else {
        console.error("Could not find user to update.")
        process.exit(1)
      }
    } else {
      console.error("Failed to create user:", error.message)
      process.exit(1)
    }
  } else {
    console.log("Demo user created and email confirmed successfully!")
    console.log("User ID:", data.user.id)
  }
}

seed()
