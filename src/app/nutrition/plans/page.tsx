"use client";

import { useEffect, useState } from "react";
import { 
  ClipboardList,
  ChevronLeft, 
  ChevronRight, 
  Target,
  Calendar,
  Zap,
  ArrowLeft,
  Loader2,
  Trophy,
  Activity,
  ChevronRight as ChevronRightIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getPlansAction } from "@/actions/nutrition.action";
import Link from "next/link";
import { format } from "date-fns";

interface TransformationPlan {
  id: string;
  goal: string;
  description: string;
  durationDays: number;
  dailyCalories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatsGrams: number;
  status: string;
  createdAt: string;
}

export default function PlansPage() {
  const [plans, setPlans] = useState<TransformationPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const fetchPlans = async (page = 1) => {
    setLoading(true);
    try {
      const data = await getPlansAction({
        page,
        limit: 10
      });
      setPlans(data.plans);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Failed to fetch plans:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans(1);
  }, []);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchPlans(newPage);
    }
  };

  return (
    <div className="px-4 md:px-8 py-6 md:py-8 max-w-[1200px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link 
            href="/nutrition/dashboard"
            className="p-2 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              Your Plans
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              All your AI-generated transformation plans
            </p>
          </div>
        </div>

        <Link 
          href="/nutrition/planner"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all"
        >
          <Zap className="w-4 h-4" />
          New Plan
        </Link>
      </div>

      {/* Content */}
      {loading ? (
        <div className="min-h-[400px] flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : plans.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {plans.map((plan) => (
            <div 
              key={plan.id}
              className="group relative rounded-2xl border border-border/50 bg-card p-6 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider",
                      plan.status === "ACTIVE" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                    )}>
                      {plan.status}
                    </span>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                      {format(new Date(plan.createdAt), "MMM d, yyyy")}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-foreground leading-tight mt-2">
                    {plan.goal}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                    {plan.description || "Personalized transformation plan tailored to your goals."}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-primary" />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {[
                  { label: "Calories", value: plan.dailyCalories, unit: "kcal" },
                  { label: "Protein", value: plan.proteinGrams, unit: "g" },
                  { label: "Carbs", value: plan.carbsGrams, unit: "g" },
                  { label: "Fats", value: plan.fatsGrams, unit: "g" },
                ].map((macro) => (
                  <div key={macro.label} className="p-3 rounded-xl bg-muted/30 border border-border/30 text-center">
                    <p className="text-lg font-bold text-foreground">{macro.value}</p>
                    <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">{macro.label}</p>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border/50">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span className="text-sm font-bold text-foreground">{plan.durationDays} Days</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-secondary" />
                    <span className="text-sm font-bold text-foreground">Advanced</span>
                  </div>
                </div>
                
                <button className="flex items-center gap-1 text-xs font-bold text-primary group-hover:gap-2 transition-all">
                  View Full Plan
                  <ChevronRightIcon className="w-4 h-4" />
                </button>
              </div>

              {/* Decorative gradient overlay */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-linear-to-bl from-primary/5 to-transparent rounded-tr-2xl -z-10" />
            </div>
          ))}
        </div>
      ) : (
        <div className="min-h-[400px] flex flex-col items-center justify-center text-center p-8 rounded-3xl border-2 border-dashed border-border/50 bg-card/50">
          <div className="w-16 h-16 rounded-2xl bg-muted/30 flex items-center justify-center mb-4">
            <ClipboardList className="w-8 h-8 text-muted-foreground/30" />
          </div>
          <h3 className="text-lg font-bold text-foreground">No plans yet</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-[280px]">
            Ready to transform? Let our AI generate a personalized nutrition and workout plan for you.
          </p>
          <Link 
            href="/nutrition/planner"
            className="mt-6 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all"
          >
            Create Your First Plan
          </Link>
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 pt-6">
          <button 
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
            className="p-2 rounded-xl bg-card border border-border disabled:opacity-50 hover:bg-muted transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="text-sm font-bold">
            Page <span className="text-primary">{pagination.page}</span> of {pagination.totalPages}
          </div>
          <button 
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.totalPages}
            className="p-2 rounded-xl bg-card border border-border disabled:opacity-50 hover:bg-muted transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
