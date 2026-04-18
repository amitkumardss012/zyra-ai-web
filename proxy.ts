import { NextRequest, NextResponse } from "next/server";
import { useAuth } from "./src/hooks/useAuth";

export async function proxy(request: NextRequest) {
  const session = await useAuth();

  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.redirect(new URL("/", request.url));
}


export const config = {
  matcher: ["/auth", "/nutrition/*"],
};