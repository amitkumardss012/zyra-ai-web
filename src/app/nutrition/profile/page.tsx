"use client";

import { useState } from "react";
import {
  UserCircle,
  Bell,
  Settings,
  TrendingUp,
  Target,
  Flame,
  Award,
  ChevronRight,
  Moon,
  Sun,
  LogOut,
  Shield,
  HelpCircle,
  Scale,
  Calendar,
  Dumbbell,
  Heart,
  Edit3,
  Camera,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ─── Mock User Data ─── */
const USER = {
  name: "John Doe",
  email: "john@example.com",
  avatar: null,
  joinDate: "March 2024",
  plan: "Pro",
};

const STATS = [
  { label: "Meals Logged", value: "342", icon: Flame, color: "text-primary" },
  { label: "Day Streak", value: "14", icon: Target, color: "text-secondary" },
  { label: "Avg Protein", value: "145g", icon: TrendingUp, color: "text-accent" },
  { label: "Achievement", value: "12", icon: Award, color: "text-violet-500" },
];

const PROGRESS_DATA = [
  { week: "W1", weight: 82 },
  { week: "W2", weight: 81.2 },
  { week: "W3", weight: 80.5 },
  { week: "W4", weight: 80.1 },
  { week: "W5", weight: 79.3 },
  { week: "W6", weight: 78.8 },
  { week: "W7", weight: 78.2 },
  { week: "W8", weight: 77.5 },
];

const ACHIEVEMENTS = [
  { label: "7-Day Streak", earned: true, icon: "🔥" },
  { label: "100 Meals", earned: true, icon: "🍽️" },
  { label: "Protein King", earned: true, icon: "💪" },
  { label: "30-Day Streak", earned: false, icon: "⭐" },
  { label: "500 Meals", earned: false, icon: "🏆" },
  { label: "1 Year", earned: false, icon: "👑" },
];

export default function ProfilePage() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const minWeight = Math.min(...PROGRESS_DATA.map((d) => d.weight)) - 1;
  const maxWeight = Math.max(...PROGRESS_DATA.map((d) => d.weight)) + 1;

  return (
    <div className="px-4 md:px-8 py-6 md:py-8 max-w-[900px] mx-auto space-y-6">
      {/* ─── Profile Header ─── */}
      <div className="rounded-2xl border border-border/50 bg-card overflow-hidden">
        {/* Banner */}
        <div className="h-28 bg-gradient-to-br from-primary via-primary/80 to-primary/40 relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.15),transparent)]" />
        </div>
        <div className="px-5 pb-5 -mt-10 relative">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4">
            {/* Avatar */}
            <div className="relative group">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-2xl font-bold text-primary-foreground border-4 border-card shadow-xl">
                {USER.name.charAt(0)}
              </div>
              <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-lg bg-background border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors shadow-sm">
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>
            {/* Info */}
            <div className="flex-1 sm:mb-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-foreground">
                  {USER.name}
                </h1>
                <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                  {USER.plan}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {USER.email}
              </p>
              <p className="text-[10px] text-muted-foreground/60 mt-0.5 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Member since {USER.joinDate}
              </p>
            </div>
            {/* Edit button */}
            <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-all duration-200 w-fit">
              <Edit3 className="w-3.5 h-3.5" />
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* ─── Quick Stats ─── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {STATS.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-border/50 bg-card p-4 hover:shadow-md hover:border-primary/10 transition-all duration-200"
          >
            <stat.icon className={cn("w-4 h-4 mb-2", stat.color)} />
            <p className="text-xl font-bold tracking-tight text-foreground">
              {stat.value}
            </p>
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mt-0.5">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* ─── Progress Tracker ─── */}
      <div className="rounded-2xl border border-border/50 bg-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Scale className="w-4 h-4 text-primary" />
            Weight Progress
          </h3>
          <span className="text-xs text-primary font-bold bg-primary/10 px-2 py-0.5 rounded-full">
            -{(PROGRESS_DATA[0].weight - PROGRESS_DATA[PROGRESS_DATA.length - 1].weight).toFixed(1)} kg
          </span>
        </div>
        {/* Simple line chart */}
        <div className="relative h-36">
          <svg className="w-full h-full" viewBox="0 0 400 120" preserveAspectRatio="none">
            {/* Grid lines */}
            {[0, 1, 2, 3].map((i) => (
              <line
                key={i}
                x1={0}
                y1={(i / 3) * 120}
                x2={400}
                y2={(i / 3) * 120}
                stroke="currentColor"
                strokeWidth={0.5}
                className="text-border/50"
              />
            ))}
            {/* Area fill */}
            <path
              d={`M${PROGRESS_DATA.map(
                (d, i) =>
                  `${(i / (PROGRESS_DATA.length - 1)) * 400},${
                    120 - ((d.weight - minWeight) / (maxWeight - minWeight)) * 120
                  }`
              ).join(" L")} L400,120 L0,120 Z`}
              fill="url(#progressGradient)"
              opacity={0.15}
            />
            {/* Line */}
            <polyline
              points={PROGRESS_DATA.map(
                (d, i) =>
                  `${(i / (PROGRESS_DATA.length - 1)) * 400},${
                    120 - ((d.weight - minWeight) / (maxWeight - minWeight)) * 120
                  }`
              ).join(" ")}
              fill="none"
              stroke="url(#lineGradient)"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Points */}
            {PROGRESS_DATA.map((d, i) => (
              <circle
                key={i}
                cx={(i / (PROGRESS_DATA.length - 1)) * 400}
                cy={120 - ((d.weight - minWeight) / (maxWeight - minWeight)) * 120}
                r={3}
                fill="var(--primary)"
                stroke="var(--card)"
                strokeWidth={2}
              />
            ))}
            <defs>
              <linearGradient id="progressGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--primary)" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
              <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="var(--primary)" />
                <stop offset="100%" stopColor="var(--secondary)" />
              </linearGradient>
            </defs>
          </svg>
          {/* X-axis labels */}
          <div className="flex justify-between mt-2">
            {PROGRESS_DATA.map((d) => (
              <span
                key={d.week}
                className="text-[9px] font-bold text-muted-foreground"
              >
                {d.week}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Achievements ─── */}
      <div className="rounded-2xl border border-border/50 bg-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Award className="w-4 h-4 text-secondary" />
            Achievements
          </h3>
          <span className="text-[10px] text-muted-foreground font-semibold">
            {ACHIEVEMENTS.filter((a) => a.earned).length}/{ACHIEVEMENTS.length}{" "}
            Earned
          </span>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {ACHIEVEMENTS.map((ach) => (
            <div
              key={ach.label}
              className={cn(
                "flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all",
                ach.earned
                  ? "bg-primary/5 border-primary/20"
                  : "bg-muted/20 border-border/30 opacity-40"
              )}
            >
              <span className="text-2xl">{ach.icon}</span>
              <span className="text-[9px] font-bold text-center text-muted-foreground leading-tight">
                {ach.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Settings ─── */}
      <div className="rounded-2xl border border-border/50 bg-card overflow-hidden">
        <div className="px-5 pt-5 pb-2">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Settings className="w-4 h-4 text-muted-foreground" />
            Settings
          </h3>
        </div>
        <div className="divide-y divide-border/30">
          {/* Notifications */}
          <div className="flex items-center justify-between px-5 py-3.5 hover:bg-muted/20 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center">
                <Bell className="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground">
                  Notifications
                </p>
                <p className="text-[10px] text-muted-foreground">
                  Meal reminders & daily reports
                </p>
              </div>
            </div>
            <button
              onClick={() => setNotifications(!notifications)}
              className={cn(
                "w-10 h-6 rounded-full transition-all duration-200 relative",
                notifications ? "bg-primary" : "bg-muted"
              )}
            >
              <div
                className={cn(
                  "w-4 h-4 rounded-full bg-white shadow-sm absolute top-1 transition-all duration-200",
                  notifications ? "left-5" : "left-1"
                )}
              />
            </button>
          </div>
          {/* Dark Mode */}
          <div className="flex items-center justify-between px-5 py-3.5 hover:bg-muted/20 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center">
                {darkMode ? (
                  <Moon className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <Sun className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground">
                  Dark Mode
                </p>
                <p className="text-[10px] text-muted-foreground">
                  Toggle theme appearance
                </p>
              </div>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={cn(
                "w-10 h-6 rounded-full transition-all duration-200 relative",
                darkMode ? "bg-primary" : "bg-muted"
              )}
            >
              <div
                className={cn(
                  "w-4 h-4 rounded-full bg-white shadow-sm absolute top-1 transition-all duration-200",
                  darkMode ? "left-5" : "left-1"
                )}
              />
            </button>
          </div>
          {/* Menu items */}
          {[
            {
              icon: Heart,
              label: "Health Goals",
              desc: "Update your fitness targets",
            },
            {
              icon: Dumbbell,
              label: "Workout Integration",
              desc: "Connect with fitness apps",
            },
            {
              icon: Shield,
              label: "Privacy & Data",
              desc: "Manage your data & privacy",
            },
            {
              icon: HelpCircle,
              label: "Help & Support",
              desc: "FAQ, contact, and feedback",
            },
          ].map((item) => (
            <button
              key={item.label}
              className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-muted/20 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center">
                  <item.icon className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">
                    {item.label}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {item.desc}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground/40" />
            </button>
          ))}
          {/* Logout */}
          <button className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-destructive/5 transition-colors text-left">
            <div className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center">
              <LogOut className="w-4 h-4 text-destructive" />
            </div>
            <p className="text-xs font-semibold text-destructive">Sign Out</p>
          </button>
        </div>
      </div>
    </div>
  );
}
