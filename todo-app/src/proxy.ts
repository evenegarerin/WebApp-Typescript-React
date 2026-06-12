import { NextRequest, NextResponse } from "next/server"
import { getSessionCookie } from "better-auth/cookies"

export function proxy(request: NextRequest) {
    const sessionCookie = getSessionCookie(request)

    if (!sessionCookie) {
        return NextResponse.redirect(new URL("/login", request.url))
    }

    return NextResponse.next()
}

export const config = {
    // alles außer /login, /register, den Auth-Endpunkten und statischen Dateien
    matcher: ["/((?!login|register|api/auth|_next|favicon.ico|.*\\..*).*)"],
}
