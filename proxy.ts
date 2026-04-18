import { NextRequest, NextResponse } from "next/server";
import { useAuth } from "./src/hooks/useAuth";
import { redirect } from "next/navigation";

async function proxy(request: NextRequest) {
  const session = await useAuth();

  if (!session) {
    redirect("/auth");
  }
  redirect("/");
}

export default proxy;

// export const config = {
//   matcher: ["/auth", "/nutrition/dashboard"],
// };


export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};