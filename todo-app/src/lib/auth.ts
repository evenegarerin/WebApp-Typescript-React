import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { db } from "@/db"
import * as authSchema from "@/db/auth-schema"

// Wie beim DB-Client: eine Instanz pro Prozess, auch über Hot Reloads hinweg.
const globalForAuth = globalThis as unknown as {
    auth?: ReturnType<typeof betterAuth>
}

export const auth = globalForAuth.auth ?? betterAuth({
    database: drizzleAdapter(db, {
        provider: "sqlite",
        schema: authSchema,
    }),
    emailAndPassword: { enabled: true },
})

if (process.env.NODE_ENV !== "production") {
    globalForAuth.auth = auth
}
