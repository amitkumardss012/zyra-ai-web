"use client"

import {
  Flame,
  Drumstick,
  Wheat,
  Droplets,
  TrendingUp,
  TrendingDown,
  Target,
  Zap,
  Apple,
  Clock,
  ChevronRight,
  Plus,
  ArrowUpRight,
  Check,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Link from "next/link";
import { getDashboardDataAction } from "@/actions/nutrition.action";

/* ─── Components ─── */

function CircularProgress({
  current,
  goal,
  size = 120,
  strokeWidth = 10,
  color,
  children,
}: {
  current: number;
  goal: number;
  size?: number;
  strokeWidth?: number;
  color: string;
  children?: React.ReactNode;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(current / goal, 1);
  const offset = circumference - progress * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted/50"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}

function MacroCard({
  label,
  current,
  goal,
  unit,
  icon: Icon,
  gradient,
}: {
  label: string;
  current: number;
  goal: number;
  unit: string;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
}) {
  const pct = goal > 0 ? Math.round((current / goal) * 100) : 0;
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card p-4 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20">
      <div className="flex items-center justify-between mb-3">
        <div
          className={cn(
            "flex items-center justify-center w-9 h-9 rounded-xl bg-linear-to-br shadow-lg",
            gradient
          )}
        >
          <Icon className="w-4 h-4 text-white" />
        </div>
        <span
          className={cn(
            "text-xs font-bold px-2 py-0.5 rounded-full",
            pct >= 100
              ? "bg-primary/10 text-primary"
              : pct >= 70
              ? "bg-secondary/10 text-secondary"
              : "bg-muted text-muted-foreground"
          )}
        >
          {pct}%
        </span>
      </div>
      <div>
        <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
          {label}
        </p>
        <div className="flex items-baseline gap-1 mt-0.5">
          <span className="text-2xl font-bold tracking-tight text-foreground">
            {current}
          </span>
          <span className="text-xs text-muted-foreground">
            / {goal}
            {unit}
          </span>
        </div>
      </div>
      {/* Progress bar */}
      <div className="mt-3 h-1.5 rounded-full bg-muted/50 overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full bg-linear-to-r transition-all duration-1000 ease-out",
            gradient
          )}
          style={{ width: `${Math.min(pct, 100)}%` }}
        />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    const fetchData = async () => {
      try {
        const dashboardData = await getDashboardDataAction();
        setData(dashboardData);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (!mounted || loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  if (!data) return null;

  const { dailyStats, weeklyData, recentMeals, nutrientHighlights, quickStats } = data;

  return (
    <div className="px-4 md:px-8 py-6 md:py-8 max-w-[1400px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            Nutrition Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track your daily nutrition goals and progress
          </p>
        </div>
        <Link 
          href="/nutrition/scanner"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-200 active:scale-[0.97] w-fit"
        >
          <Plus className="w-4 h-4" />
          Log Meal
        </Link>
      </div>

      {/* ─── Main Calorie Ring + Macros ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Calorie Ring */}
        <div className="lg:col-span-4 rounded-2xl border border-border/50 bg-card p-6 flex flex-col items-center justify-center">
          <CircularProgress
            current={dailyStats.calories.current}
            goal={dailyStats.calories.goal}
            size={180}
            strokeWidth={14}
            color="url(#calorieGradient)"
          >
            <svg width={0} height={0} className="absolute">
              <defs>
                <linearGradient
                  id="calorieGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="oklch(0.82 0.21 145)" />
                  <stop offset="100%" stopColor="oklch(0.75 0.2 45)" />
                </linearGradient>
              </defs>
            </svg>
            <div className="flex flex-col items-center">
              <Flame className="w-5 h-5 text-primary mb-1" />
              <span className="text-3xl font-bold tracking-tight text-foreground">
                {dailyStats.calories.current}
              </span>
              <span className="text-[11px] text-muted-foreground font-medium">
                / {dailyStats.calories.goal} kcal
              </span>
            </div>
          </CircularProgress>
          <div className="mt-4 text-center">
            <p className="text-sm font-semibold text-foreground">
              {Math.max(0, dailyStats.calories.goal - dailyStats.calories.current)} kcal
              remaining
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {dailyStats.calories.current >= dailyStats.calories.goal 
                ? "Calorie goal reached! 🎯" 
                : "You're on track for today! 💪"}
            </p>
          </div>
        </div>

        {/* Macro Cards */}
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <MacroCard
            label="Protein"
            current={dailyStats.protein.current}
            goal={dailyStats.protein.goal}
            unit="g"
            icon={Drumstick}
            gradient="from-primary to-primary/70"
          />
          <MacroCard
            label="Carbs"
            current={dailyStats.carbs.current}
            goal={dailyStats.carbs.goal}
            unit="g"
            icon={Wheat}
            gradient="from-secondary to-secondary/70"
          />
          <MacroCard
            label="Fats"
            current={dailyStats.fats.current}
            goal={dailyStats.fats.goal}
            unit="g"
            icon={Droplets}
            gradient="from-accent to-accent/70"
          />

          {/* Nutrient Highlights Card */}
          <div className="sm:col-span-3 rounded-2xl border border-border/50 bg-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Zap className="w-4 h-4 text-secondary" />
                Micronutrients
              </h3>
              <button className="text-xs text-muted-foreground hover:text-foreground font-medium flex items-center gap-1 transition-colors">
                See all <ChevronRight className="w-3 h-3" />
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {nutrientHighlights.map((n: any) => {
                const current = parseFloat(n.amount);
                const target = parseFloat(n.target);
                const pct = target > 0 ? Math.round((current / target) * 100) : 0;
                return (
                  <div
                    key={n.name}
                    className="flex flex-col gap-2 p-3 rounded-xl bg-muted/30 border border-border/30"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-foreground">
                        {n.name}
                      </span>
                      <span className="text-[10px] text-muted-foreground font-medium">
                        {pct}%
                      </span>
                    </div>
                    <div className="h-1 rounded-full bg-muted/50 overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full bg-linear-to-r",
                          n.color
                        )}
                        style={{ width: `${Math.min(pct, 100)}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {n.amount}{" "}
                      <span className="text-muted-foreground/50">
                        / {n.target}
                      </span>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ─── Weekly Chart + Recent Meals ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

        {/* Weekly Chart */}
        <div className="lg:col-span-7 min-w-0 rounded-3xl border border-border/40 bg-card/60 backdrop-blur-sm p-6 overflow-hidden relative group transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 hover:border-primary/20">
          <div className="flex items-center justify-between mb-8">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                Performance Analytics
              </h3>
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">Weekly Calorie Intake vs Goal</p>
            </div>
            <div className="flex items-center gap-4 text-[10px] font-bold text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-primary shadow-lg shadow-primary/20" />
                Actual
              </div>
              <div className="flex items-center gap-1.5 opacity-50">
                <div className="w-2 h-2 rounded-full bg-border" />
                Target
              </div>
            </div>
          </div>
          
          <div className="h-52 w-full mt-4 min-h-[200px]">
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCalories" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid 
                  strokeDasharray="8 8" 
                  vertical={false} 
                  stroke="var(--border)" 
                  strokeOpacity={0.2}
                />
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: "var(--muted-foreground)", fontSize: 10, fontWeight: 800 }}
                  dy={15}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: "var(--muted-foreground)", fontSize: 10, fontWeight: 800 }}
                />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-card/80 backdrop-blur-xl border border-border/50 p-4 rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200">
                          <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-2">{payload[0].payload.day}</p>
                          <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-black text-foreground tracking-tighter">
                              {payload[0].value}
                            </span>
                            <span className="text-[10px] font-bold text-muted-foreground uppercase">kcal</span>
                          </div>
                          <div className="mt-3 flex items-center gap-2 text-[10px] font-bold py-1 px-2 rounded-lg bg-primary/10 text-primary w-fit">
                            <Check className="w-3 h-3" />
                            Goal: {payload[0].payload.goal}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="calories" 
                  stroke="var(--primary)" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorCalories)" 
                  animationDuration={2000}
                  dot={{ 
                    r: 4, 
                    fill: "var(--background)", 
                    stroke: "var(--primary)", 
                    strokeWidth: 2,
                    strokeOpacity: 1
                  }}
                  activeDot={{ 
                    r: 6, 
                    fill: "var(--primary)", 
                    stroke: "var(--background)", 
                    strokeWidth: 2,
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Meals */}
        <div className="lg:col-span-5 rounded-2xl border border-border/50 bg-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Apple className="w-4 h-4 text-primary" />
              Recent Meals
            </h3>
            <Link
              href="/nutrition/logs"
              className="text-xs text-muted-foreground hover:text-foreground font-medium flex items-center gap-1 transition-colors"
            >
              View all <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-2">
            {recentMeals.map((meal: any) => (
              <div
                key={meal.id}
                className="group flex items-center gap-3 p-3 rounded-xl hover:bg-muted/40 transition-all duration-200 cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center text-lg">
                  {meal.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">
                    {meal.name}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {meal.time}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-foreground">
                    {meal.calories}
                  </p>
                  <p className="text-[10px] text-muted-foreground">kcal</p>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground/40 group-hover:text-primary transition-colors" />
              </div>
            ))}
            {recentMeals.length === 0 && (
              <div className="py-8 text-center text-muted-foreground text-xs italic">
                No meals logged recently
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ─── Quick Stats ─── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {quickStats.map((stat: any) => {
          const Icon = stat.label.includes("Protein") ? TrendingUp : stat.label.includes("Logged") ? Target : stat.label.includes("Streak") ? Flame : TrendingDown;
          return (
            <div
              key={stat.label}
              className="rounded-2xl border border-border/50 bg-card p-4 hover:shadow-md hover:border-primary/10 transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-2">
                <Icon
                  className={cn(
                    "w-4 h-4",
                    stat.trend === "up"
                      ? "text-primary"
                      : stat.trend === "down"
                      ? "text-secondary"
                      : "text-muted-foreground"
                  )}
                />
                <span
                  className={cn(
                    "text-[10px] font-bold px-1.5 py-0.5 rounded-full",
                    stat.trend === "up"
                      ? "bg-primary/10 text-primary"
                      : stat.trend === "down"
                      ? "bg-secondary/10 text-secondary"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {stat.change}
                </span>
              </div>
              <p className="text-xl font-bold tracking-tight text-foreground">
                {stat.value}
              </p>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mt-0.5">
                {stat.label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
