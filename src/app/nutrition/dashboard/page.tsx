"use client";

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
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ─── Mock Data ─── */
const DAILY_STATS = {
  calories: { current: 1850, goal: 2200, unit: "kcal" },
  protein: { current: 125, goal: 160, unit: "g" },
  carbs: { current: 180, goal: 250, unit: "g" },
  fats: { current: 55, goal: 70, unit: "g" },
};

const RECENT_MEALS = [
  {
    id: 1,
    name: "Grilled Chicken Salad",
    time: "12:30 PM",
    calories: 420,
    protein: 45,
    emoji: "🥗",
  },
  {
    id: 2,
    name: "Protein Smoothie",
    time: "10:00 AM",
    calories: 280,
    protein: 35,
    emoji: "🥤",
  },
  {
    id: 3,
    name: "Oatmeal & Berries",
    time: "8:00 AM",
    calories: 350,
    protein: 12,
    emoji: "🥣",
  },
  {
    id: 4,
    name: "Greek Yogurt",
    time: "3:00 PM",
    calories: 150,
    protein: 18,
    emoji: "🍶",
  },
];

const WEEKLY_DATA = [
  { day: "Mon", calories: 2100, goal: 2200 },
  { day: "Tue", calories: 1950, goal: 2200 },
  { day: "Wed", calories: 2300, goal: 2200 },
  { day: "Thu", calories: 2050, goal: 2200 },
  { day: "Fri", calories: 1800, goal: 2200 },
  { day: "Sat", calories: 2400, goal: 2200 },
  { day: "Sun", calories: 1850, goal: 2200 },
];

const NUTRIENT_HIGHLIGHTS = [
  { name: "Fiber", amount: "18g", target: "25g", color: "from-amber-400 to-orange-500" },
  { name: "Vitamin C", amount: "72mg", target: "90mg", color: "from-yellow-400 to-amber-500" },
  { name: "Iron", amount: "14mg", target: "18mg", color: "from-red-400 to-rose-500" },
  { name: "Calcium", amount: "800mg", target: "1000mg", color: "from-blue-400 to-indigo-500" },
];

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
  const pct = Math.round((current / goal) * 100);
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card p-4 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20">
      <div className="flex items-center justify-between mb-3">
        <div
          className={cn(
            "flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br shadow-lg",
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
            "h-full rounded-full bg-gradient-to-r transition-all duration-1000 ease-out",
            gradient
          )}
          style={{ width: `${Math.min(pct, 100)}%` }}
        />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const maxBar = Math.max(...WEEKLY_DATA.map((d) => d.calories));

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
        <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-200 active:scale-[0.97] w-fit">
          <Plus className="w-4 h-4" />
          Log Meal
        </button>
      </div>

      {/* ─── Main Calorie Ring + Macros ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Calorie Ring */}
        <div className="lg:col-span-4 rounded-2xl border border-border/50 bg-card p-6 flex flex-col items-center justify-center">
          <CircularProgress
            current={DAILY_STATS.calories.current}
            goal={DAILY_STATS.calories.goal}
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
                {DAILY_STATS.calories.current}
              </span>
              <span className="text-[11px] text-muted-foreground font-medium">
                / {DAILY_STATS.calories.goal} kcal
              </span>
            </div>
          </CircularProgress>
          <div className="mt-4 text-center">
            <p className="text-sm font-semibold text-foreground">
              {DAILY_STATS.calories.goal - DAILY_STATS.calories.current} kcal
              remaining
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              You&apos;re on track for today! 💪
            </p>
          </div>
        </div>

        {/* Macro Cards */}
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <MacroCard
            label="Protein"
            current={DAILY_STATS.protein.current}
            goal={DAILY_STATS.protein.goal}
            unit="g"
            icon={Drumstick}
            gradient="from-primary to-primary/70"
          />
          <MacroCard
            label="Carbs"
            current={DAILY_STATS.carbs.current}
            goal={DAILY_STATS.carbs.goal}
            unit="g"
            icon={Wheat}
            gradient="from-secondary to-secondary/70"
          />
          <MacroCard
            label="Fats"
            current={DAILY_STATS.fats.current}
            goal={DAILY_STATS.fats.goal}
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
              {NUTRIENT_HIGHLIGHTS.map((n) => {
                const current = parseFloat(n.amount);
                const target = parseFloat(n.target);
                const pct = Math.round((current / target) * 100);
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
                          "h-full rounded-full bg-gradient-to-r",
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
        <div className="lg:col-span-7 rounded-2xl border border-border/50 bg-card p-5">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              Weekly Overview
            </h3>
            <div className="flex items-center gap-3 text-[10px] font-semibold text-muted-foreground">
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-primary" />
                Intake
              </span>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-border" />
                Goal
              </span>
            </div>
          </div>
          {/* Bar chart */}
          <div className="flex items-end gap-2 h-40">
            {WEEKLY_DATA.map((d) => {
              const height = (d.calories / maxBar) * 100;
              const goalH = (d.goal / maxBar) * 100;
              const isToday = d.day === "Sun";
              return (
                <div
                  key={d.day}
                  className="flex-1 flex flex-col items-center gap-1"
                >
                  <span className="text-[10px] font-bold text-muted-foreground mb-1">
                    {d.calories}
                  </span>
                  <div className="relative w-full flex justify-center">
                    <div
                      className="w-full max-w-[32px] rounded-lg bg-muted/40 relative overflow-hidden"
                      style={{ height: `${goalH}%` }}
                    >
                      <div
                        className={cn(
                          "absolute bottom-0 left-0 right-0 rounded-lg transition-all duration-700",
                          isToday
                            ? "bg-gradient-to-t from-primary to-primary/60"
                            : d.calories > d.goal
                            ? "bg-gradient-to-t from-secondary to-secondary/60"
                            : "bg-gradient-to-t from-primary/60 to-primary/30"
                        )}
                        style={{ height: `${(d.calories / d.goal) * 100}%` }}
                      />
                    </div>
                  </div>
                  <span
                    className={cn(
                      "text-[10px] font-bold mt-1",
                      isToday ? "text-primary" : "text-muted-foreground"
                    )}
                  >
                    {d.day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Meals */}
        <div className="lg:col-span-5 rounded-2xl border border-border/50 bg-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Apple className="w-4 h-4 text-primary" />
              Recent Meals
            </h3>
            <button className="text-xs text-muted-foreground hover:text-foreground font-medium flex items-center gap-1 transition-colors">
              View all <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-2">
            {RECENT_MEALS.map((meal) => (
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
          </div>
        </div>
      </div>

      {/* ─── Quick Stats ─── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          {
            label: "Avg Daily Protein",
            value: "138g",
            change: "+12%",
            trend: "up",
            icon: TrendingUp,
          },
          {
            label: "Meals Logged",
            value: "28",
            change: "This week",
            trend: "neutral",
            icon: Target,
          },
          {
            label: "Best Streak",
            value: "14 days",
            change: "Current",
            trend: "up",
            icon: Flame,
          },
          {
            label: "Calorie Deficit",
            value: "-350",
            change: "kcal/day",
            trend: "down",
            icon: TrendingDown,
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-border/50 bg-card p-4 hover:shadow-md hover:border-primary/10 transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-2">
              <stat.icon
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
        ))}
      </div>
    </div>
  );
}
