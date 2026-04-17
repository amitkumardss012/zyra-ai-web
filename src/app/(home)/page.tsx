import { useAuth } from "@/hooks/useAuth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await useAuth();

  if (!session) {
    redirect("/auth");
  }

  redirect("/nutrition/dashboard");
}
