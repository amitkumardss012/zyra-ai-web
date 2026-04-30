import { getCurrentUser } from "@/actions/user.action";
import { useAuth } from "@/hooks/useAuth";
import { useToken } from "@/hooks/useToken";
import { cn } from "@/lib/utils";
import {
  ChevronRight,
  Sparkles,
  RefreshCcw,
  CalendarHeart,
  User,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SignOutButton } from "../_components/client/sign-out-button";

export default async function ProfilePage() {
  const session = await useAuth();
  if (!session) {
    redirect("/auth");
  }

  const token = await useToken();
  const user = await getCurrentUser(token);

  if (!user || !user.isProfileCompleted) {
    redirect("/complete-onboarding");
  }

  return (
    <div className="px-6 py-12 md:py-24 max-w-[500px] mx-auto space-y-12">
      {/* ─── Ultra Minimal Header ─── */}
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center overflow-hidden border border-border">
          {user.avatar ? (
            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
          ) : (
            <User className="w-8 h-8 text-muted-foreground/40" />
          )}
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{user.name}</h1>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
      </div>

      {/* ─── Compact Navigation ─── */}
      <div className="space-y-2">
        <Link
          href="/nutrition/logs"
          className="group flex items-center justify-between p-4 rounded-2xl bg-card border border-border/50 hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center gap-4">
            <RefreshCcw className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">History</span>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground/30" />
        </Link>

        <Link
          href="/nutrition/plans"
          className="group flex items-center justify-between p-4 rounded-2xl bg-card border border-border/50 hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center gap-4">
            <CalendarHeart className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">My Plans</span>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground/30" />
        </Link>
      </div>

      {/* ─── Sign Out (Moved Above) ─── */}
      <div className="flex justify-center pt-4 border-t border-border/30">
        <SignOutButton />
      </div>

      {/* ─── Beauty Mode Switcher (At the very bottom) ─── */}
      <div className="rounded-[2rem] border border-primary/10 bg-linear-to-br from-primary/5 via-transparent to-transparent p-6 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 group-hover:opacity-20 transition-all duration-500">
          <Sparkles className="w-20 h-20 text-primary" />
        </div>

        <div className="relative z-10 flex flex-col items-start justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              Switch to Beauty Mode
            </h3>
            <p className="text-[10px] text-muted-foreground leading-relaxed max-w-[280px]">
              Explore AI-powered skincare routines and beauty insights tailored to you.
            </p>
          </div>
          <Link
            href="/beauty/dashboard"
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all"
          >
            Switch Now
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
