import { getCurrentUser } from "@/actions/user.action";
import { useAuth } from "@/hooks/useAuth";
import { useToken } from "@/hooks/useToken";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await useAuth();

  if (!session) {
    redirect("/auth");
  }

  const token = await useToken();
  const user = await getCurrentUser(token);
  console.log({user})

  if (!user || !user.isProfileCompleted) {
    redirect("/complete-onboarding");
  }

  redirect(`/${user.preferredMode.toLowerCase()}/dashboard`);
}
