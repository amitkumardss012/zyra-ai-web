import { api } from "@/api/api";
import { showError, showSuccess } from "@/utils/message";
import { redirect } from "next/navigation";

export const authAction = async (payload: { name: string; email: string; avatar: string }) => {
  let redirectTo: string | null = null;
  try {
    const res = await api.post("/user/auth", payload);
    if (res.data.success) {
      redirectTo = "/complete-onboarding";
      showSuccess(res.data.message);
    } else {
      redirectTo = "/";
    }
  } catch (error) {
    showError(error);
    redirectTo = "/auth";
  }

  if (redirectTo) {
    redirect(redirectTo);
  }
};