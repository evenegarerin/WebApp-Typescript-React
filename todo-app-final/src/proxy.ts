import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export function proxy(request: NextRequest) {
    const sessionCookie = getSessionCookie(request);

    if (!sessionCookie) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
}

export const config = {
    // everything except /login, /register, the auth endpoints and favicon.ico
    matcher: ["/((?!login|register|api/auth|_next|favicon.ico|.*\\..*).*)"],
};
