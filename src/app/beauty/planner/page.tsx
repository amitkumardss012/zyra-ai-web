"use client";

import { useState } from "react";
import {
  CalendarHeart,
  Target,
  Sparkles,
  ChevronRight,
  Clock,
  Check,
  ArrowRight,
  Loader2,
  Droplet,
  Sun,
  Moon,
  Flower2,
  Wand2
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ─── Types ─── */
type GoalType = "clear" | "anti-aging" | "glow" | "repair";

interface GoalOption {
  id: GoalType;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  gradient: string;
}

/* ─── Data ─── */
const GOAL_OPTIONS: GoalOption[] = [
  {
    id: "clear",
    label: "Clear Skin (Acne)",
    description: "Blemish control & acne care",
    icon: Droplet,
    color: "text-emerald-500",
    gradient: "from-emerald-400 to-green-500",
  },
  {
    id: "glow",
    label: "Radiant Glow",
    description: "Brightening & evening tone",
    icon: Sun,
    color: "text-amber-500",
    gradient: "from-amber-400 to-orange-500",
  },
  {
    id: "anti-aging",
    label: "Anti-Aging",
    description: "Firming & reducing wrinkles",
    icon: Moon,
    color: "text-violet-500",
    gradient: "from-violet-500 to-purple-500",
  },
  {
    id: "repair",
    label: "Barrier Repair",
    description: "Hydration & protecting skin",
    icon: Flower2,
    color: "text-blue-500",
    gradient: "from-blue-400 to-cyan-500",
  },
];

const MOCK_PLAN = {
  skinType: "Combination-Sensitive",
  routineItems: 6,
  recommendations: 4,
  routines: [
    {
      time: "Morning",
      name: "AM Routine",
      items: ["Gentle Gel Cleanser", "Vitamin C Serum (10%)", "Lightweight Moisturizer", "Mineral Sunscreen SPF 50"],
      duration: "5 mins",
    },
    {
      time: "Evening",
      name: "PM Routine",
      items: ["Oil Cleansing Balm (Double Cleanse)", "Hydrating Cream Cleanser", "Niacinamide Serum", "Rich Ceramide Moisturizer"],
      duration: "10 mins",
    },
    {
      time: "Weekly",
      name: "Treatments",
      items: ["BHA Exfoliant (2x a week)", "Hydrating Sheet Mask (Sunday)"],
      duration: "15 mins",
    },
  ],
  tips: [
    "Always apply products from thinnest to thickest consistency",
    "Never skip sunscreen, even on cloudy days",
    "Change your pillowcase twice a week",
    "Drink at least 2 liters of water daily",
  ],
};

export default function BeautyPlannerPage() {
  const [selectedGoal, setSelectedGoal] = useState<GoalType | null>(null);
  const [skinType, setSkinType] = useState("");
  const [concerns, setConcerns] = useState("");
  const [generating, setGenerating] = useState(false);
  const [plan, setPlan] = useState<typeof MOCK_PLAN | null>(null);
  const [step, setStep] = useState(1);

  const canProceed =
    step === 1
      ? !!selectedGoal
      : step === 2
      ? !!skinType && !!concerns
      : true;

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setPlan(MOCK_PLAN);
      setGenerating(false);
      setStep(3);
    }, 3000);
  };

  const handleNext = () => {
    if (step === 2) {
      handleGenerate();
    } else if (step < 3) {
      setStep(step + 1);
    }
  };

  const handleReset = () => {
    setSelectedGoal(null);
    setSkinType("");
    setConcerns("");
    setPlan(null);
    setStep(1);
  };

  return (
    <div className="px-4 md:px-8 py-6 md:py-8 max-w-[900px] mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg shadow-primary/20">
            <CalendarHeart className="w-5 h-5 text-primary-foreground" />
          </div>
          Routine Planner
        </h1>
        <p className="text-sm text-muted-foreground mt-2 ml-[52px]">
          Create an AI-powered skincare and beauty routine tailored to your skin type
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-2">
        {[
          { num: 1, label: "Goal" },
          { num: 2, label: "Details" },
          { num: 3, label: "Your Routine" },
        ].map((s, i) => (
          <div key={s.num} className="flex items-center gap-2 flex-1">
            <div className="flex items-center gap-2 flex-1">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 shrink-0",
                  step >= s.num
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {step > s.num ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  s.num
                )}
              </div>
              <span
                className={cn(
                  "text-xs font-semibold hidden sm:block",
                  step >= s.num ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {s.label}
              </span>
            </div>
            {i < 2 && (
              <div
                className={cn(
                  "flex-1 h-px transition-colors duration-300",
                  step > s.num ? "bg-primary" : "bg-border"
                )}
              />
            )}
          </div>
        ))}
      </div>

      {/* ─── Step 1: Goal Selection ─── */}
      {step === 1 && (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
          <h2 className="text-base font-bold text-foreground">
            What&apos;s your primary skin goal?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {GOAL_OPTIONS.map((goal) => (
              <button
                key={goal.id}
                onClick={() => setSelectedGoal(goal.id)}
                className={cn(
                  "group relative flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 text-left",
                  selectedGoal === goal.id
                    ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                    : "border-border/50 bg-card hover:border-primary/30 hover:shadow-sm"
                )}
              >
                {/* Selection indicator */}
                {selectedGoal === goal.id && (
                  <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                    <Check className="w-3 h-3 text-primary-foreground" />
                  </div>
                )}
                <div
                  className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center bg-linear-to-br shadow-lg",
                    goal.gradient
                  )}
                >
                  <goal.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">
                    {goal.label}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {goal.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ─── Step 2: Details ─── */}
      {step === 2 && (
        <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
          <h2 className="text-base font-bold text-foreground">
            Tell us about your skin
          </h2>
          
          <div className="space-y-2">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Flower2 className="w-3.5 h-3.5 text-muted-foreground" />
              Skin Type
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: "dry", label: "Dry", desc: "Flaky or tight" },
                { id: "oily", label: "Oily", desc: "Shiny or greasy" },
                { id: "combo", label: "Combination", desc: "Oily T-zone" },
                { id: "sensitive", label: "Sensitive", desc: "Easily irritated" },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setSkinType(opt.id)}
                  className={cn(
                    "p-3 rounded-xl border text-left transition-all duration-200",
                    skinType === opt.id
                      ? "border-primary bg-primary/5"
                      : "border-border/50 bg-card hover:border-primary/30"
                  )}
                >
                  <p className="text-xs font-bold text-foreground">
                    {opt.label}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {opt.desc}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-muted-foreground" />
              Specific Concerns (Optional)
            </label>
            <input
              type="text"
              value={concerns}
              onChange={(e) => setConcerns(e.target.value)}
              placeholder="e.g. Dark circles, redness, hyperpigmentation..."
              className="w-full px-4 py-3 rounded-xl border border-border/50 bg-background text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10 transition-all"
            />
          </div>
        </div>
      )}

      {/* ─── Step 3 (Generating / Result) ─── */}
      {step === 3 && generating && (
        <div className="flex flex-col items-center justify-center py-20 animate-in fade-in duration-300">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-primary/10 to-primary/5 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
              <Wand2 className="w-3.5 h-3.5 text-primary-foreground" />
            </div>
          </div>
          <p className="text-sm font-semibold text-foreground mt-5">
            Crafting your personalized routine...
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            AI is analyzing your skin profile and creating the perfect regimen
          </p>
        </div>
      )}

      {step === 3 && plan && !generating && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Plan Overview */}
          <div className="rounded-2xl border border-primary/20 bg-linear-to-br from-primary/5 to-transparent p-5">
            <div className="flex items-center gap-2 mb-3">
              <Wand2 className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-bold text-primary">
                Your AI-Powered Routine
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                {
                  label: "Skin Profile",
                  value: plan.skinType,
                  icon: Flower2,
                },
                {
                  label: "Daily Steps",
                  value: `${plan.routineItems} products`,
                  icon: Clock,
                },
                {
                  label: "Key Ingredients",
                  value: `${plan.recommendations} suggested`,
                  icon: Droplet,
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="p-3 rounded-xl bg-background/80 border border-border/30"
                >
                  <stat.icon className="w-4 h-4 text-primary mb-1.5" />
                  <p className="text-sm font-bold text-foreground">
                    {stat.value}
                  </p>
                  <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Routine Plan */}
          <div className="rounded-2xl border border-border/50 bg-card p-5">
            <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
              <Sun className="w-4 h-4 text-primary" />
              Daily Routine Schedule
            </h3>
            <div className="space-y-2">
              {plan.routines.map((routine, i) => (
                <div
                  key={i}
                  className="group flex gap-4 p-3 rounded-xl hover:bg-muted/30 transition-all duration-200"
                >
                  <div className="flex flex-col items-center shrink-0">
                    <div className="w-9 h-9 rounded-lg bg-muted/50 flex items-center justify-center">
                      {routine.time === "Morning" ? <Sun className="w-4 h-4 text-amber-500" /> : routine.time === "Evening" ? <Moon className="w-4 h-4 text-indigo-400" /> : <Clock className="w-4 h-4 text-muted-foreground" />}
                    </div>
                    {i < plan.routines.length - 1 && (
                      <div className="w-px h-full bg-border/50 mt-1" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-foreground">
                          {routine.name}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          {routine.time}
                        </p>
                      </div>
                      <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                        ~{routine.duration}
                      </span>
                    </div>
                    <ul className="mt-1.5 space-y-0.5 border-l-2 border-primary/20 pl-2 ml-1">
                      {routine.items.map((item, j) => (
                        <li
                          key={j}
                          className="text-xs text-muted-foreground flex items-center gap-1.5"
                        >
                          <span className="text-[10px] font-bold text-primary/60">{j + 1}.</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="rounded-2xl border border-border/50 bg-card p-5">
            <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-secondary" />
              Esthetician Tips
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {plan.tips.map((tip, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 p-3 rounded-xl bg-muted/20"
                >
                  <div className="w-5 h-5 rounded-md bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-primary" />
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {tip}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Reset */}
          <button
            onClick={handleReset}
            className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5 mx-auto"
          >
            Create a new routine
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Navigation buttons */}
      {step < 3 && (
        <div className="flex items-center justify-between pt-2">
          {step > 1 ? (
            <button
               onClick={() => setStep(step - 1)}
              className="px-4 py-2.5 rounded-xl border border-border text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-all duration-200"
            >
              Back
            </button>
          ) : (
            <div />
          )}
          <button
            onClick={handleNext}
            disabled={!canProceed}
            className={cn(
              "inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 active:scale-[0.97]",
              canProceed
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-primary/40"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            )}
          >
            {step === 2 ? (
              <>
                <Sparkles className="w-4 h-4" />
                Generate Routine
              </>
            ) : (
              <>
                Next
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
