import { apiClient } from "@/api/api-client";
import { showError, showSuccess } from "@/utils/message";
import { redirect } from "next/navigation";
import { signOut } from "next-auth/react";
import { updateTag } from "next/cache";

export const authAction = async (payload: { name: string; email: string; avatar: string }) => {
  let redirectTo: string | null = null;
  try {
    const res = await apiClient.post("/user/auth", payload);
    if (res.data.success) {
      const user = res.data.data;
      if (user.isProfileCompleted) {
        redirectTo = `/${user.preferredMode.toLowerCase()}/dashboard`;
      } else {
        redirectTo = "/complete-onboarding";
      }
      showSuccess(res.data.message);
    } else {
      redirectTo = "/";
    }
  } catch (error) {
    showError(error);
    await new Promise((resolve) => setTimeout(resolve, 3000));
    await signOut({ callbackUrl: "/auth" });
    return;
  }

  if (redirectTo) {
    redirect(redirectTo);
  }
};