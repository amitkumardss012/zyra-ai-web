"use client";

import { apiClient } from "@/api/api-client";
import { AILoader } from "@/components/ui/ai-loader";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  CalendarHeart,
  Check,
  ChevronRight,
  Clock,
  Dumbbell,
  Flame,
  HelpCircle,
  MessageSquare,
  Sparkles,
  Target,
  TrendingDown,
  TrendingUp,
  Utensils,
  Zap
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

/* ─── Types ─── */
type GoalType = "lose" | "gain" | "maintain" | "recomp" | "custom";

interface GoalOption {
  id: GoalType;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  gradient: string;
}

interface Question {
  id: string;
  text: string;
  type: "text" | "number" | "select";
  options?: string[];
  isMandatory: boolean;
}

interface Answer {
  questionId: string;
  questionText: string;
  answer: string;
}

interface TransformationPlan {
  id: string;
  goal: string;
  description?: string;
  dailyCalories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatsGrams: number;
  durationDays: number;
  dietSchedule: {
    mealName: string;
    time: string;
    items: string[];
    calories: number;
  }[];
  workoutRoutine: {
    day: string;
    focus: string;
    exercises: {
      name: string;
      sets: number;
      reps: string;
      notes?: string;
    }[];
  }[];
  guidelines: {
    toEat: string[];
    toAvoid: string[];
    tips: string[];
  };
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
    id: "recomp",
    label: "Body Recomp",
    description: "Burn fat & build muscle",
    icon: Dumbbell,
    color: "text-violet-500",
    gradient: "from-violet-500 to-purple-500",
  },
  {
    id: "custom",
    label: "Custom Goal",
    description: "Describe your specific target",
    icon: Target,
    color: "text-accent",
    gradient: "from-accent to-accent/60",
  },
];

export default function PlannerPage() {
  const [step, setStep] = useState(1);
  const [selectedGoal, setSelectedGoal] = useState<GoalType | null>(null);
  const [description, setDescription] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  
  const [plan, setPlan] = useState<TransformationPlan | null>(null);


  const handleGoalSelect = (id: GoalType) => {
    setSelectedGoal(id);
    if (id !== "custom") {
      setDescription(GOAL_OPTIONS.find(o => o.id === id)?.label || "");
    } else {
      setDescription("");
    }
  };

  const handleGenerateQuestions = async () => {
    if (!description.trim()) {
      toast.error("Please describe your goal");
      return;
    }

    setLoading(true);
    try {
      const res = await apiClient.post("/nutrition/plan/questions", {
        goal: selectedGoal === "custom" ? "Custom" : selectedGoal,
        description: description,
      });
      setQuestions(res.data.data);
      setStep(2);
    } catch (err) {
      toast.error("Failed to generate assessment questions");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePlan = async () => {
    // Validate mandatory answers
    const missing = questions.filter(q => q.isMandatory && !answers[q.id]);
    if (missing.length > 0) {
      toast.error(`Please answer all mandatory questions: ${missing.map(q => q.text).join(", ")}`);
      return;
    }

    setLoading(true);
    try {
      const formattedAnswers = Object.entries(answers).map(([id, ans]) => ({
        questionId: id,
        questionText: questions.find(q => q.id === id)?.text || "",
        answer: ans,
      }));

      const res = await apiClient.post("/nutrition/plan/generate", {
        goal: selectedGoal === "custom" ? "Custom" : selectedGoal,
        description: description,
        answers: formattedAnswers,
      });
      setPlan(res.data.data);
      setStep(4);
    } catch (err) {
      toast.error("Failed to generate your plan");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStep(1);
    setSelectedGoal(null);
    setDescription("");
    setQuestions([]);
    setAnswers({});
    setPlan(null);
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
          Create a scientifically-backed transformation plan tailored to your body
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-2">
        {[
          { num: 1, label: "Goal" },
          { num: 2, label: "Assessment" },
          { num: 3, label: "Analysis" },
          { num: 4, label: "Your Plan" },
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
                {step > s.num ? <Check className="w-3.5 h-3.5" /> : s.num}
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
            {i < 3 && (
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
      {step === 1 && !loading && (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
          <h2 className="text-base font-bold text-foreground">
            What&apos;s your transformation goal?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {GOAL_OPTIONS.map((goal) => (
              <button
                key={goal.id}
                onClick={() => handleGoalSelect(goal.id)}
                className={cn(
                  "group relative flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 text-left",
                  selectedGoal === goal.id
                    ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                    : "border-border/50 bg-card hover:border-primary/30 hover:shadow-sm"
                )}
              >
                {selectedGoal === goal.id && (
                  <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                    <Check className="w-3 h-3 text-primary-foreground" />
                  </div>
                )}
                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center bg-linear-to-br shadow-lg", goal.gradient)}>
                  <goal.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">{goal.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{goal.description}</p>
                </div>
              </button>
            ))}
          </div>

          {(selectedGoal === "custom" || selectedGoal) && (
            <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-muted-foreground" />
                {selectedGoal === "custom" ? "Describe your goal in detail" : "Any additional details?"}
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={selectedGoal === "custom" ? "e.g., I want to lose 5kg in 2 months while maintaining muscle for my wedding..." : "Optional: Add more context..."}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-border/50 bg-background text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10 transition-all resize-none"
              />
            </div>
          )}

          <div className="flex justify-end">
            <button
              onClick={handleGenerateQuestions}
              disabled={!description.trim() || loading}
              className={cn(
                "inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 active:scale-[0.97]",
                description.trim()
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-primary/40"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              )}
            >
              Next Step
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ─── Step 2: Assessment Questions ─── */}
      {step === 2 && !loading && (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-foreground">
              Deep Assessment
            </h2>
            <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-1 rounded-md uppercase tracking-wider">
              {questions.length} Questions
            </span>
          </div>

          <div className="space-y-5">
            {questions.map((q, i) => (
              <div key={q.id} className="p-5 rounded-2xl border border-border/50 bg-card/50 space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-foreground">
                      {i + 1}. {q.text}
                      {q.isMandatory && <span className="text-destructive ml-1">*</span>}
                    </p>
                  </div>
                </div>

                {q.type === "select" ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {q.options?.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => setAnswers({ ...answers, [q.id]: opt })}
                        className={cn(
                          "px-4 py-2 rounded-lg border text-xs font-medium transition-all",
                          answers[q.id] === opt
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-background hover:border-primary/30"
                        )}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                ) : (
                  <input
                    type={q.type === "number" ? "number" : "text"}
                    value={answers[q.id] || ""}
                    onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                    placeholder="Type your answer..."
                    className="w-full px-4 py-2.5 rounded-lg border border-border/50 bg-background text-sm text-foreground focus:outline-none focus:border-primary/40"
                  />
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4">
            <button
              onClick={() => setStep(1)}
              className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              Change Goal
            </button>
            <button
              onClick={handleGeneratePlan}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 active:scale-[0.97] transition-all"
            >
              <Sparkles className="w-4 h-4" />
              Generate My Full Plan
            </button>
          </div>
        </div>
      )}

      {/* ─── Step 3: Loading / Analysis ─── */}
      {loading && <AILoader type="nutrition" />}

      {/* ─── Step 4: Final Plan Result ─── */}
      {step === 4 && plan && !loading && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Plan Overview Stats */}
          <div className="rounded-2xl border border-primary/20 bg-linear-to-br from-primary/5 to-transparent p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <h2 className="text-sm font-bold text-primary uppercase tracking-widest">
                  Personalized Transformation Guide
                </h2>
              </div>
              <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-1 rounded-md">
                {plan.durationDays} DAYS PHASE
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Daily Calories", value: plan.dailyCalories, unit: "kcal", icon: Flame },
                { label: "Protein", value: plan.proteinGrams, unit: "g", icon: Zap },
                { label: "Carbohydrates", value: plan.carbsGrams, unit: "g", icon: Utensils },
                { label: "Fats", value: plan.fatsGrams, unit: "g", icon: Target },
              ].map((stat) => (
                <div key={stat.label} className="p-4 rounded-xl bg-background/80 border border-border/30 shadow-xs">
                  <stat.icon className="w-4 h-4 text-primary mb-2" />
                  <p className="text-xl font-bold text-foreground">
                    {stat.value}
                    <span className="text-xs font-normal text-muted-foreground ml-1">{stat.unit}</span>
                  </p>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Diet Schedule */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <Utensils className="w-4 h-4 text-primary" />
              Strategic Nutrition Schedule
            </h3>
            <div className="space-y-3">
              {plan.dietSchedule.map((meal, i) => (
                <div key={i} className="group flex gap-4 p-4 rounded-2xl bg-card border border-border/50 hover:border-primary/20 transition-all">
                  <div className="flex flex-col items-center shrink-0">
                    <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-muted-foreground" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-foreground">{meal.mealName}</p>
                        <p className="text-[10px] text-muted-foreground font-medium">{meal.time}</p>
                      </div>
                      <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-lg">
                        {meal.calories} kcal
                      </span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {meal.items.map((item, j) => (
                        <span key={j} className="text-[10px] font-medium bg-muted/50 px-2.5 py-1 rounded-md text-muted-foreground border border-border/30">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Workout Routine */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <Dumbbell className="w-4 h-4 text-secondary" />
              Training Split & Protocol
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {plan.workoutRoutine.map((routine, i) => (
                <div key={i} className="p-5 rounded-2xl border border-border/50 bg-card hover:shadow-md transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm font-bold text-foreground">{routine.day}</p>
                    <span className="text-[10px] font-bold text-secondary bg-secondary/10 px-2 py-1 rounded-md">
                      {routine.focus}
                    </span>
                  </div>
                  <div className="space-y-3">
                    {routine.exercises.map((ex, j) => (
                      <div key={j} className="flex items-start justify-between gap-4 p-2.5 rounded-lg bg-muted/20 border border-border/10">
                        <div className="space-y-0.5">
                          <p className="text-xs font-bold text-foreground">{ex.name}</p>
                          {ex.notes && <p className="text-[9px] text-muted-foreground">{ex.notes}</p>}
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-[10px] font-bold text-primary">{ex.sets} × {ex.reps}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Scientific Guidelines */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
             <div className="p-5 rounded-2xl border border-border/50 bg-green-500/5 space-y-3">
               <h4 className="text-xs font-bold text-green-600 uppercase flex items-center gap-2">
                 <Check className="w-3.5 h-3.5" />
                 Prioritize
               </h4>
               <ul className="space-y-1.5">
                 {plan.guidelines.toEat.map((item, i) => (
                   <li key={i} className="text-[11px] text-muted-foreground flex items-center gap-2">
                     <div className="w-1 h-1 rounded-full bg-green-500/40" />
                     {item}
                   </li>
                 ))}
               </ul>
             </div>
             <div className="p-5 rounded-2xl border border-border/50 bg-red-500/5 space-y-3">
               <h4 className="text-xs font-bold text-red-600 uppercase flex items-center gap-2">
                 <ArrowRight className="w-3.5 h-3.5" />
                 Minimize
               </h4>
               <ul className="space-y-1.5">
                 {plan.guidelines.toAvoid.map((item, i) => (
                   <li key={i} className="text-[11px] text-muted-foreground flex items-center gap-2">
                     <div className="w-1 h-1 rounded-full bg-red-500/40" />
                     {item}
                   </li>
                 ))}
               </ul>
             </div>
             <div className="p-5 rounded-2xl border border-border/50 bg-primary/5 space-y-3">
               <h4 className="text-xs font-bold text-primary uppercase flex items-center gap-2">
                 <HelpCircle className="w-3.5 h-3.5" />
                 Pro Tips
               </h4>
               <ul className="space-y-1.5">
                 {plan.guidelines.tips.map((item, i) => (
                   <li key={i} className="text-[11px] text-muted-foreground flex items-center gap-2">
                     <div className="w-1 h-1 rounded-full bg-primary/40" />
                     {item}
                   </li>
                 ))}
               </ul>
             </div>
          </div>

          <button
            onClick={handleReset}
            className="flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-all mx-auto py-4"
          >
            <TrendingUp className="w-3.5 h-3.5" />
            Create a New Transformation Plan
          </button>
        </div>
      )}
    </div>
  );
}

