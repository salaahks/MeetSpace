import { NextRequest, NextResponse } from "next/server";
import { PUBLIC_PATHS } from "./src/utils/constants";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublic = PUBLIC_PATHS.some((path: string) => pathname.startsWith(path));

  if (isPublic) {
    return NextResponse.next();
  }

  // MSAL stocke le token dans localStorage (côté client uniquement)
  // La protection réelle est gérée par AuthStatus côté client
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|images|locales).*)"],
};