import { NextResponse } from "next/server"
import { db } from "@/db"
import { todos } from "@/db/schema"
import { todoInputSchema } from "@/schemas/Todo"

export async function GET() {
    const all = await db.select().from(todos)
    return NextResponse.json(all)
}

export async function POST(request: Request) {
    const body = await request.json()

    const result = todoInputSchema.safeParse(body);

    if (!result.success) {
        return {
            success: false,
            message: result.error.issues[0]?.message ?? "Invalid input."
        };
    }

    await db.insert(todos).values(result.data)
    return NextResponse.json({ ok: true })
}