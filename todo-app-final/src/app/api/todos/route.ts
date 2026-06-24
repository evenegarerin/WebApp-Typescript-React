import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { todos } from "@/db/schema";
import { auth } from "@/lib/auth";
import { todoInputSchema } from "@/schemas/Todo";

// Wofür dieser Endpunkt nützlich wäre: Er macht die Todos für Clients
// außerhalb dieser App erreichbar — z.B. eine Mobile-App, ein CLI-Tool
// oder einen anderen Service, der per HTTP integriert. Server Actions
// sind dagegen an das Next.js-RPC-Protokoll gebunden und nur aus der
// eigenen App aufrufbar. Für unsere eigene UI bleiben Server Actions
// trotzdem der Hauptweg: typsicher Ende-zu-Ende, kein manuelles fetch,
// kein JSON-Parsing und dieselbe Zod-Validierung ohne Extra-Schritt.
//
// Beobachtung zum POST-Test (curl/fetch): Über die API Route müssen wir
// URL, Methode, Header und Body selbst zusammenbauen und die Antwort
// selbst parsen — die Server Action ist dagegen ein normaler, typisierter
// Funktionsaufruf ohne Extra-Schritt.

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
