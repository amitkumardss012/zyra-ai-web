"use client";

import { useSession } from "next-auth/react";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

const LOGIN_TOAST_FLAG = "zyra_expect_login_toast";

export function PostAuthToast() {
  const { status } = useSession();
  const done = useRef(false);

  useEffect(() => {
    if (status !== "authenticated" || done.current) return;
    try {
      if (sessionStorage.getItem(LOGIN_TOAST_FLAG) === "1") {
        sessionStorage.removeItem(LOGIN_TOAST_FLAG);
        toast.success("Login successfully");
        done.current = true;
      }
    } catch {
      /* sessionStorage unavailable */
    }
  }, [status]);

  return null;
}
