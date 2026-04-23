"use client";

import { useAuthSession } from "@/hooks/useAuth";
import { useEffect } from "react";
import { authAction } from "../auth/auth.action";

export default function CallbackPage() {

  const session = useAuthSession();
    
  useEffect(() => {
    if (!session?.user) return;
    authAction({
      name: session?.user?.name!,
      email: session?.user?.email!,
      avatar: session?.user?.picture!,
    });
  }, [session?.user?.email]);

  return (
      <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
  );
}
