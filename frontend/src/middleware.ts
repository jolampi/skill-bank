import { NextRequest, NextResponse } from "next/server";

import { getRole } from "./services/backend/auth";

const ADMIN_PATHS = ["/users"];
const HOME_PATH = "/";
const LOGIN_PATH = "/login";

export async function middleware(request: NextRequest) {
  const role = await getRole();
  const pathName = request.nextUrl.pathname;

  if (role === null && pathName !== LOGIN_PATH) {
    return NextResponse.redirect(new URL(LOGIN_PATH, request.nextUrl));
  } else if (role !== null && pathName === LOGIN_PATH) {
    return NextResponse.redirect(new URL(HOME_PATH, request.nextUrl));
  } else if (role !== "Admin" && ADMIN_PATHS.includes(pathName)) {
    return NextResponse.redirect(new URL(HOME_PATH, request.nextUrl));
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
