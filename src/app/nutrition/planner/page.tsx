"use client";

import { useState } from "react";
import {
  CalendarHeart,
  Target,
  TrendingUp,
  TrendingDown,
  Scale,
  Dumbbell,
  Sparkles,
  ChevronRight,
  Clock,
  Flame,
  Utensils,
  Check,
  ArrowRight,
  Loader2,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AILoader } from "@/components/ui/ai-loader";

/* ─── Types ─── */
type GoalType = "lose" | "gain" | "maintain" | "recomp";

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
    id: "lose",
    label: "Lose Weight",
    description: "Fat loss & lean physique",
    icon: TrendingDown,
    color: "text-secondary",
    gradient: "from-secondary to-secondary/60",
  },
  {
    id: "gain",
    label: "Gain Weight",
    description: "Muscle building & bulking",
    icon: TrendingUp,
    color: "text-primary",
    gradient: "from-primary to-primary/60",
  },
  {
    id: "maintain",
    label: "Maintain",
    description: "Keep current physique",
    icon: Scale,
    color: "text-accent",
    gradient: "from-accent to-accent/60",
  },
  {
    id: "recomp",
    label: "Body Recomp",
    description: "Burn fat & build muscle",
    icon: Dumbbell,
    color: "text-violet-500",
    gradient: "from-violet-500 to-purple-500",
  },
];

const MOCK_PLAN = {
  dailyCalories: 2400,
  protein: 180,
  carbs: 260,
  fats: 70,
  meals: [
    {
      time: "7:00 AM",
      name: "Breakfast",
      items: ["Oatmeal with berries & whey protein", "2 boiled eggs", "Black coffee"],
      calories: 520,
    },
    {
      time: "10:00 AM",
      name: "Snack",
      items: ["Greek yogurt with almonds", "Banana"],
      calories: 280,
    },
    {
      time: "1:00 PM",
      name: "Lunch",
      items: ["Grilled chicken breast 200g", "Brown rice 1 cup", "Steamed broccoli"],
      calories: 620,
    },
    {
      time: "4:00 PM",
      name: "Pre-Workout",
      items: ["Protein shake with PB", "Apple"],
      calories: 350,
    },
    {
      time: "7:00 PM",
      name: "Dinner",
      items: ["Salmon fillet 180g", "Sweet potato", "Mixed salad with olive oil"],
      calories: 580,
    },
    {
      time: "9:00 PM",
      name: "Evening Snack",
      items: ["Casein protein shake", "Handful of walnuts"],
      calories: 250,
    },
  ],
  tips: [
    "Drink 3-4 liters of water daily",
    "Eat protein within 30 mins post-workout",
    "Prioritize sleep for recovery (7-8 hrs)",
    "Track your meals daily for consistency",
  ],
};

export default function PlannerPage() {
  const [selectedGoal, setSelectedGoal] = useState<GoalType | null>(null);
  const [weight, setWeight] = useState("");
  const [targetWeight, setTargetWeight] = useState("");
  const [activity, setActivity] = useState<string>("");
  const [generating, setGenerating] = useState(false);
  const [plan, setPlan] = useState<typeof MOCK_PLAN | null>(null);
  const [step, setStep] = useState(1);

  const canProceed =
    step === 1
      ? !!selectedGoal
      : step === 2
      ? !!weight && !!targetWeight && !!activity
      : true;

  const handleGenerate = () => {
    setGenerating(true);
    setStep(3);
    setTimeout(() => {
      setPlan(MOCK_PLAN);
      setGenerating(false);
    }, 4000);
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
    setWeight("");
    setTargetWeight("");
    setActivity("");
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
          Transformation Planner
        </h1>
        <p className="text-sm text-muted-foreground mt-2 ml-[52px]">
          Create an AI-powered nutrition plan tailored to your body
          transformation goals
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-2">
        {[
          { num: 1, label: "Goal" },
          { num: 2, label: "Details" },
          { num: 3, label: "Your Plan" },
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
            What&apos;s your transformation goal?
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
            Tell us about yourself
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5 text-muted-foreground" />
                Current Weight (kg)
              </label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="e.g. 75"
                className="w-full px-4 py-3 rounded-xl border border-border/50 bg-background text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-muted-foreground" />
                Target Weight (kg)
              </label>
              <input
                type="number"
                value={targetWeight}
                onChange={(e) => setTargetWeight(e.target.value)}
                placeholder="e.g. 70"
                className="w-full px-4 py-3 rounded-xl border border-border/50 bg-background text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10 transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Dumbbell className="w-3.5 h-3.5 text-muted-foreground" />
              Activity Level
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                {
                  id: "sedentary",
                  label: "Sedentary",
                  desc: "Little to no exercise",
                },
                {
                  id: "moderate",
                  label: "Moderate",
                  desc: "3-5 days/week",
                },
                {
                  id: "active",
                  label: "Very Active",
                  desc: "6-7 days/week",
                },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setActivity(opt.id)}
                  className={cn(
                    "p-3 rounded-xl border text-left transition-all duration-200",
                    activity === opt.id
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
        </div>
      )}

      {/* ─── Step 3 (Generating / Result) ─── */}
      {step === 3 && generating && (
        <AILoader type="nutrition" />
      )}

      {step === 3 && plan && !generating && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Plan Overview */}
          <div className="rounded-2xl border border-primary/20 bg-linear-to-br from-primary/5 to-transparent p-5">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-bold text-primary">
                Your AI-Powered Plan
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                {
                  label: "Calories",
                  value: `${plan.dailyCalories}`,
                  unit: "kcal/day",
                  icon: Flame,
                },
                {
                  label: "Protein",
                  value: `${plan.protein}g`,
                  unit: "/day",
                  icon: Zap,
                },
                {
                  label: "Carbs",
                  value: `${plan.carbs}g`,
                  unit: "/day",
                  icon: Utensils,
                },
                {
                  label: "Fats",
                  value: `${plan.fats}g`,
                  unit: "/day",
                  icon: Target,
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="p-3 rounded-xl bg-background/80 border border-border/30"
                >
                  <stat.icon className="w-4 h-4 text-primary mb-1.5" />
                  <p className="text-lg font-bold text-foreground">
                    {stat.value}
                    <span className="text-[10px] font-normal text-muted-foreground ml-0.5">
                      {stat.unit}
                    </span>
                  </p>
                  <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Meal Plan */}
          <div className="rounded-2xl border border-border/50 bg-card p-5">
            <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
              <Utensils className="w-4 h-4 text-primary" />
              Daily Meal Plan
            </h3>
            <div className="space-y-2">
              {plan.meals.map((meal, i) => (
                <div
                  key={i}
                  className="group flex gap-4 p-3 rounded-xl hover:bg-muted/30 transition-all duration-200"
                >
                  <div className="flex flex-col items-center shrink-0">
                    <div className="w-9 h-9 rounded-lg bg-muted/50 flex items-center justify-center">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                    </div>
                    {i < plan.meals.length - 1 && (
                      <div className="w-px h-full bg-border/50 mt-1" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-foreground">
                          {meal.name}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          {meal.time}
                        </p>
                      </div>
                      <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                        {meal.calories} kcal
                      </span>
                    </div>
                    <ul className="mt-1.5 space-y-0.5">
                      {meal.items.map((item, j) => (
                        <li
                          key={j}
                          className="text-xs text-muted-foreground flex items-center gap-1.5"
                        >
                          <div className="w-1 h-1 rounded-full bg-primary/40" />
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
              Pro Tips
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
            Create a new plan
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
                Generate Plan
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
