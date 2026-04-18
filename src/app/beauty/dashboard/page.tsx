"use client"

import {
  Sparkle,
  Droplet,
  Sun,
  ShieldCheck,
  TrendingUp,
  Target,
  Wand2,
  Flower2,
  Clock,
  ChevronRight,
  Plus,
  ArrowUpRight,
  AlertCircle,
  Leaf,
  Check
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
  AreaChart,
  Area,
} from "recharts";
import { useEffect, useState } from "react";

/* ─── Mock Data ─── */
const DAILY_ROUTINE = {
  stepsCompleted: 3,
  totalSteps: 5,
};

const RECENT_SCANS = [
  {
    id: 1,
    name: "Hyaluronic Acid Serum",
    time: "Today, 9:30 AM",
    score: 95,
    status: "Excellent",
    emoji: "💧",
  },
  {
    id: 2,
    name: "Vitamin C Brightening",
    time: "Yesterday",
    score: 82,
    status: "Good",
    emoji: "🍊",
  },
  {
    id: 3,
    name: "Matte Foundation",
    time: "2 days ago",
    score: 45,
    status: "Has Toxins",
    emoji: "⚠️",
  },
  {
    id: 4,
    name: "Mineral Sunscreen SPF 50",
    time: "3 days ago",
    score: 98,
    status: "Excellent",
    emoji: "☀️",
  },
];

const WEEKLY_DATA = [
  { day: "Mon", score: 85, target: 80 },
  { day: "Tue", score: 90, target: 80 },
  { day: "Wed", score: 75, target: 80 },
  { day: "Thu", score: 88, target: 80 },
  { day: "Fri", score: 92, target: 80 },
  { day: "Sat", score: 95, target: 80 },
  { day: "Sun", score: 80, target: 80 },
];

const INGREDIENT_HIGHLIGHTS = [
  { name: "Hydration", amount: "Excellent", color: "from-blue-400 to-cyan-500", pct: 95 },
  { name: "Anti-Aging", amount: "Good", color: "from-fuchsia-400 to-pink-500", pct: 75 },
  { name: "Toxin-Free", amount: "Moderate", color: "from-amber-400 to-orange-500", pct: 60 },
  { name: "Sun Protection", amount: "High", color: "from-yellow-400 to-amber-500", pct: 90 },
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

function StatCard({
  label,
  value,
  subvalue,
  icon: Icon,
  gradient,
  pct,
}: {
  label: string;
  value: string | number;
  subvalue: string;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  pct: number;
}) {
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
            pct >= 80
              ? "bg-primary/10 text-primary"
              : pct >= 50
              ? "bg-secondary/10 text-secondary"
              : "bg-destructive/10 text-destructive"
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
            {value}
          </span>
          <span className="text-xs text-muted-foreground">
            {subvalue}
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

export default function BeautyDashboardPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const maxBar = 100;

  return (
    <div className="px-4 md:px-8 py-6 md:py-8 max-w-[1400px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            Beauty Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track your skincare routines and product purity
          </p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-200 active:scale-[0.97] w-fit">
          <Plus className="w-4 h-4" />
          Scan Product
        </button>
      </div>

      {/* ─── Main Ring + Stats ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Main Ring */}
        <div className="lg:col-span-4 rounded-2xl border border-border/50 bg-card p-6 flex flex-col items-center justify-center">
          <CircularProgress
            current={DAILY_ROUTINE.stepsCompleted}
            goal={DAILY_ROUTINE.totalSteps}
            size={180}
            strokeWidth={14}
            color="url(#beautyGradient)"
          >
            <svg width={0} height={0} className="absolute">
              <defs>
                <linearGradient
                  id="beautyGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="oklch(0.65 0.25 340)" />
                  <stop offset="100%" stopColor="oklch(0.7 0.15 320)" />
                </linearGradient>
              </defs>
            </svg>
            <div className="flex flex-col items-center">
              <Sparkle className="w-6 h-6 text-primary mb-1" />
              <span className="text-3xl font-bold tracking-tight text-foreground">
                {DAILY_ROUTINE.stepsCompleted}/{DAILY_ROUTINE.totalSteps}
              </span>
              <span className="text-[11px] text-muted-foreground font-medium">
                Routine Steps
              </span>
            </div>
          </CircularProgress>
          <div className="mt-4 text-center">
            <p className="text-sm font-semibold text-foreground">
              Keep it up! 🌸
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Your skin is glowing today!
            </p>
          </div>
        </div>

        {/* Macro Cards */}
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            label="Clean Products"
            value="12"
            subvalue="/ 15 items"
            icon={Leaf}
            gradient="from-emerald-400 to-green-500"
            pct={80}
          />
          <StatCard
            label="Skin Hydration"
            value="Optimal"
            subvalue="Level"
            icon={Droplet}
            gradient="from-blue-400 to-cyan-500"
            pct={92}
          />
          <StatCard
            label="Sun Protection"
            value="Active"
            subvalue="SPF 50"
            icon={Sun}
            gradient="from-amber-400 to-orange-500"
            pct={100}
          />

          {/* Highlights Card */}
          <div className="sm:col-span-3 rounded-2xl border border-border/50 bg-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-primary" />
                Product Purity Analysis
              </h3>
              <button className="text-xs text-muted-foreground hover:text-foreground font-medium flex items-center gap-1 transition-colors">
                Details <ChevronRight className="w-3 h-3" />
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {INGREDIENT_HIGHLIGHTS.map((n) => {
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
                        {n.pct}%
                      </span>
                    </div>
                    <div className="h-1 rounded-full bg-muted/50 overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full bg-linear-to-r",
                          n.color
                        )}
                        style={{ width: `${Math.min(n.pct, 100)}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">
                      Status:{" "}
                      <span className="text-muted-foreground/80 font-medium">
                        {n.amount}
                      </span>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ─── Weekly Chart + Recent Scans ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Weekly Chart */}
        <div className="lg:col-span-7 min-w-0 rounded-3xl border border-border/40 bg-card/60 backdrop-blur-sm p-6 overflow-hidden relative group transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 hover:border-primary/20">
          <div className="flex items-center justify-between mb-8">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                Skin Health Score
              </h3>
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-[0.1em]">Weekly performance tracking</p>
            </div>
            <div className="flex items-center gap-4 text-[10px] font-bold text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-primary shadow-lg shadow-primary/20" />
                Score
              </div>
              <div className="flex items-center gap-1.5 opacity-50">
                <div className="w-2 h-2 rounded-full bg-border" />
                Target
              </div>
            </div>
          </div>
          
          <div className="h-52 w-full mt-4 min-h-[200px]">
            {mounted ? (
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={WEEKLY_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
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
                              <span className="text-[10px] font-bold text-muted-foreground uppercase">Points</span>
                            </div>
                            <div className="mt-3 flex items-center gap-2 text-[10px] font-bold py-1 px-2 rounded-lg bg-primary/10 text-primary w-fit">
                              <Check className="w-3 h-3" />
                              Target: {payload[0].payload.target}
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="score" 
                    stroke="var(--primary)" 
                    strokeWidth={4}
                    fillOpacity={1} 
                    fill="url(#colorScore)" 
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
            ) : (
              <div className="w-full h-full bg-muted/10 animate-pulse rounded-2xl" />
            )}
          </div>
        </div>

        {/* Recent Scans */}
        <div className="lg:col-span-5 rounded-2xl border border-border/50 bg-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Flower2 className="w-4 h-4 text-primary" />
              Recent Product Scans
            </h3>
            <button className="text-xs text-muted-foreground hover:text-foreground font-medium flex items-center gap-1 transition-colors">
              View all <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-2">
            {RECENT_SCANS.map((scan) => (
              <div
                key={scan.id}
                className="group flex items-center gap-3 p-3 rounded-xl hover:bg-muted/40 transition-all duration-200 cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center text-lg">
                  {scan.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">
                    {scan.name}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {scan.time}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className={cn(
                    "text-sm font-bold",
                    scan.score >= 80 ? "text-emerald-500" :
                    scan.score >= 50 ? "text-amber-500" :
                    "text-destructive"
                  )}>
                    {scan.score}/100
                  </p>
                  <p className="text-[10px] text-muted-foreground">{scan.status}</p>
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
            label: "Routine Streak",
            value: "14 Days",
            change: "Current",
            trend: "up",
            icon: TrendingUp,
          },
          {
            label: "Products Scanned",
            value: "32",
            change: "Total",
            trend: "neutral",
            icon: Target,
          },
          {
            label: "Purity Score",
            value: "88%",
            change: "+5% mo",
            trend: "up",
            icon: Sparkle,
          },
          {
            label: "Harmful Items Found",
            value: "2",
            change: "Action needed",
            trend: "down",
            icon: AlertCircle,
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
                    ? "text-destructive"
                    : "text-muted-foreground"
                )}
              />
              <span
                className={cn(
                  "text-[10px] font-bold px-1.5 py-0.5 rounded-full",
                  stat.trend === "up"
                    ? "bg-primary/10 text-primary"
                    : stat.trend === "down"
                    ? "bg-destructive/10 text-destructive"
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
