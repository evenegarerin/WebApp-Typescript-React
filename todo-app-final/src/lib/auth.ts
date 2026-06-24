import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import * as authSchema from "@/db/auth-schema";

const createAuth = () =>
    betterAuth({
        database: drizzleAdapter(db, {
            provider: "sqlite",
            schema: authSchema,
        }),
        emailAndPassword: { enabled: true },
    });

const globalForAuth = globalThis as unknown as {
    auth?: ReturnType<typeof createAuth>;
};

export const auth = globalForAuth.auth ?? createAuth();

if (process.env.NODE_ENV !== "production") {
    globalForAuth.auth = auth;
}
