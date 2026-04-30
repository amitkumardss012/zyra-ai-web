"use client";

import { getNutritionLogsAction } from "@/actions/nutrition.action";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  Droplets,
  Drumstick,
  Flame,
  Loader2,
  Search,
  Wheat
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

interface NutritionLog {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  mealType: string;
  imageUrl?: string;
  createdAt: string;
  healthScore: number;
}

export default function NutritionLogsPage() {
  const [logs, setLogs] = useState<NutritionLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  
  const observer = useRef<IntersectionObserver | null>(null);
  const lastElementRef = useCallback((node: HTMLDivElement | null) => {
    if (loading || initialLoading) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && pagination.page < pagination.totalPages) {
        fetchLogs(pagination.page + 1, true);
      }
    });
    
    if (node) observer.current.observe(node);
  }, [loading, initialLoading, pagination]);

  const fetchLogs = async (page = 1, append = false) => {
    if (append) setLoading(true);
    else setInitialLoading(true);
    
    try {
      const data = await getNutritionLogsAction({
        page,
        limit: 10,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      });
      
      setLogs(prev => append ? [...prev, ...data.logs] : data.logs);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Failed to fetch logs:", error);
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(1, false);
  }, [startDate, endDate]);

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
              Food History
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Browse and filter all your logged meals
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          <div className="relative group">
            <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-xl border border-border bg-card text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
          <span className="text-muted-foreground">to</span>
          <div className="relative group">
            <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-xl border border-border bg-card text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      {initialLoading ? (
        <div className="min-h-[400px] flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : logs.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {logs.map((log, index) => (
              <div
                key={log.id}
                ref={index === logs.length - 1 ? lastElementRef : null}
                className="group rounded-2xl border border-border/50 bg-card overflow-hidden hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20 transition-all duration-300"
              >
                {/* Image Area */}
                <div className="relative aspect-video bg-muted/20">
                  {log.imageUrl ? (
                    <img
                      src={log.imageUrl}
                      alt={log.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Flame className="w-8 h-8 text-muted-foreground/20" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2 px-2 py-1 rounded-lg bg-background/80 backdrop-blur-sm border border-border/50 text-[10px] font-bold text-primary">
                    {log.mealType}
                  </div>
                  <div className="absolute bottom-2 left-2 px-2 py-1 rounded-lg bg-background/80 backdrop-blur-sm border border-border/50 flex items-center gap-1.5">
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      log.healthScore >= 80 ? "bg-primary" : log.healthScore >= 60 ? "bg-secondary" : "bg-destructive"
                    )} />
                    <span className="text-[10px] font-bold">Health Score: {log.healthScore}</span>
                  </div>
                </div>

                {/* Info Area */}
                <div className="p-4 space-y-4">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-foreground leading-tight">{log.name}</h3>
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground whitespace-nowrap">
                      <Clock className="w-3 h-3" />
                      {format(new Date(log.createdAt), "MMM d, h:mm a")}
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { label: "Cals", value: log.calories, icon: Flame, color: "text-primary" },
                      { label: "Prot", value: log.protein, icon: Drumstick, color: "text-emerald-500" },
                      { label: "Carb", value: log.carbs, icon: Wheat, color: "text-secondary" },
                      { label: "Fat", value: log.fats, icon: Droplets, color: "text-accent" },
                    ].map((stat) => (
                      <div key={stat.label} className="text-center p-1.5 rounded-xl bg-muted/30 border border-border/30">
                        <stat.icon className={cn("w-3 h-3 mx-auto mb-1", stat.color)} />
                        <p className="text-xs font-bold text-foreground">{stat.value}</p>
                        <p className="text-[8px] text-muted-foreground font-black uppercase tracking-tighter">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Loading more indicator */}
          {loading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 text-primary animate-spin" />
            </div>
          )}
          
          {/* End of results message */}
          {!loading && pagination.page >= pagination.totalPages && logs.length > 0 && (
            <div className="text-center py-8 text-muted-foreground text-sm font-medium">
              You&apos;ve reached the end of your history ✨
            </div>
          )}
        </>
      ) : (
        <div className="min-h-[400px] flex flex-col items-center justify-center text-center p-8 rounded-3xl border-2 border-dashed border-border/50 bg-card/50">
          <div className="w-16 h-16 rounded-2xl bg-muted/30 flex items-center justify-center mb-4">
            <Search className="w-8 h-8 text-muted-foreground/30" />
          </div>
          <h3 className="text-lg font-bold text-foreground">No logs found</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-[280px]">
            Try adjusting your filters or log your first meal using the scanner.
          </p>
          <Link
            href="/nutrition/scanner"
            className="mt-6 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all"
          >
            Go to Scanner
          </Link>
        </div>
      )}
    </div>
  );
}
