import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Check if accessing dashboard routes
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    const token = request.cookies.get("auth-token")?.value

    // Simple check - if token exists, allow access
    // Detailed verification will be done in the page component
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url))
    }

    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$).*)",
  ],
}