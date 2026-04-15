import { useAuth } from "@/hooks/useAuth";
import { redirect } from "next/navigation";
import { signOut } from "../../../auth";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
    const session = await useAuth();

    if (!session) {
        redirect("/auth");  
    }

    return (
        <div className="flex-1 p-8 pt-6 space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">Welcome back, {session.user?.email}</p>
            </div>
            
            <form action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
            }}>
                <Button variant="destructive" type="submit" className="px-6 py-2 rounded-md transition-colors">
                    Sign Out
                </Button>
            </form>
        </div>
    );
}