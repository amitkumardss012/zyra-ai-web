"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export function SignOutButton() {
  const handleSignOut = () => {
    signOut({ callbackUrl: "/auth" });
  };

  return (
    <button 
      onClick={handleSignOut}
      className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-destructive/5 transition-colors text-left"
    >
      <div className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center">
        <LogOut className="w-4 h-4 text-destructive" />
      </div>
      <p className="text-xs font-semibold text-destructive">Sign Out</p>
    </button>
  );
}
