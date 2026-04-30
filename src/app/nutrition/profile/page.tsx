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
  Lock,
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
    <div className="min-h-full flex flex-col justify-center py-8 md:py-0 px-6 max-w-[500px] mx-auto space-y-10 md:space-y-12">
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

      {/* ─── Beauty Mode Switcher (Locked / Coming Soon) ─── */}
      <div className="rounded-[2rem] border border-border/50 bg-muted/20 p-6 relative overflow-hidden group opacity-80 cursor-not-allowed grayscale">
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-all duration-500">
          <Sparkles className="w-20 h-20 text-muted-foreground" />
        </div>

        <div className="relative z-10 flex flex-col items-start justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-muted-foreground flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Beauty Mode
            </h3>
            <p className="text-[10px] text-muted-foreground/60 leading-relaxed max-w-[280px]">
              AI-powered skincare routines and beauty insights. Coming soon to your profile.
            </p>
          </div>
          <div
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-muted text-muted-foreground text-xs font-bold border border-border transition-all"
          >
            <Lock className="w-3 h-3" />
            Coming Soon
          </div>
        </div>
      </div>
    </div>
  );
}
