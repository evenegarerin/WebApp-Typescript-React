import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { todos } from "@/db/schema";
import { auth } from "@/lib/auth";
import { todoInputSchema } from "@/schemas/Todo";

const requireUserId = async (): Promise<string | null> => {
    const session = await auth.api.getSession({ headers: await headers() });
    return session?.user.id ?? null;
};

export async function GET() {
    const userId = await requireUserId();
    if (!userId) {
        return NextResponse.json({ ok: false, message: "Not authenticated." }, { status: 401 });
    }

    const all = await db.select().from(todos).where(eq(todos.userId, userId));
    return NextResponse.json(all);
}

export async function POST(request: Request) {
    const userId = await requireUserId();
    if (!userId) {
        return NextResponse.json({ ok: false, message: "Not authenticated." }, { status: 401 });
    }

    const body = await request.json();

    const result = todoInputSchema.safeParse(body);

    if (!result.success) {
        return NextResponse.json(
            {
                ok: false,
                message: result.error.issues[0]?.message ?? "Invalid input.",
            },
            { status: 400 },
        );
    }

    await db.insert(todos).values({ ...result.data, userId });
    return NextResponse.json({ ok: true });
}
