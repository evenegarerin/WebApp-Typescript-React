import { createClient, type Client } from "@libsql/client"
import { drizzle } from "drizzle-orm/libsql"
import * as schema from "./schema"
import * as authSchema from "./auth-schema"

// Im Dev-Modus erzeugt Hot Reload dieses Modul immer wieder neu. Ohne
// Zwischenspeicher auf globalThis sammeln sich dabei offene DB-Verbindungen
// an, bis der Dev-Server wegen Speicherdrucks neu startet.
const globalForDb = globalThis as unknown as { dbClient?: Client }

const client = globalForDb.dbClient ?? createClient({ url: "file:data.db" })

if (process.env.NODE_ENV !== "production") {
    globalForDb.dbClient = client
}

export const db = drizzle(client, {
    schema: { ...schema, ...authSchema },
})
