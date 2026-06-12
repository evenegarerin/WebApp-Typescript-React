import { NextResponse } from "next/server"
import { db } from "@/db"
import { todos } from "@/db/schema"
import { todoInputSchema } from "@/schemas/Todo"

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
export async function GET() {
    const all = await db.select().from(todos)
    return NextResponse.json(all)
}

export async function POST(request: Request) {
    const body = await request.json()

    const result = todoInputSchema.safeParse(body);

    if (!result.success) {
        return NextResponse.json(
            {
                ok: false,
                message: result.error.issues[0]?.message ?? "Invalid input."
            },
            { status: 400 },
        );
    }

    await db.insert(todos).values(result.data)
    return NextResponse.json({ ok: true })
}
