
import { useAuth } from "@/hooks/useAuth";
import { Lock } from "lucide-react";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { signIn, signOut } from "../../auth";

export const metadata: Metadata = {
  title: "Authentication",
  description: "Sign in to your account",
};

export default async function AuthPage() {

  const session = await useAuth();

  if (session) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">You are logged in!</h1>
          <p className="text-muted-foreground text-lg">{session.user?.email}</p>
        </div>
        <form action={async () => {
          "use server";
          await signOut();
        }}>
          <button type="submit" className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md transition-colors">
            Sign Out
          </button>
        </form>
      </div>
    )
  }
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm space-y-8 text-center">
        <div className="space-y-2">
          <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4 ring-1 ring-primary/20">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
          <p className="text-muted-foreground text-lg">
            Sign in to your account to continue
          </p>
        </div>

        <div className="space-y-6">
          <form action={async () => {
            "use server";
            await signIn("google", { redirectTo: "/" });
          }}>
            <button
              // variant="outline"
              className="w-full h-12 text-base font-medium cursor-pointer "
              type="submit"
            >
              <GoogleIcon className="mr-2 h-5 w-5" />
              Sign in with Google
            </button>
          </form>

          <p className="text-xs text-center text-muted-foreground px-4 leading-relaxed">
            By clicking continue, you agree to our{" "}
            <a
              href="#"
              className="underline underline-offset-4 hover:text-primary transition-colors"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="#"
              className="underline underline-offset-4 hover:text-primary transition-colors"
            >
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
      <path d="M1 1h22v22H1z" fill="none" />
    </svg>
  );
}