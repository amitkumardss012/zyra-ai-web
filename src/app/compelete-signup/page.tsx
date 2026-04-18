"use client";

import React, { useState } from "react";
import {
  User,
  Venus,
  Mars,
  ChevronRight,
  ChevronLeft,
  Calendar,
  Scale,
  Ruler,
  TrendingUp,
  Check,
  UserPlus,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Step = 1 | 2 | 3 | 4;

export default function CompleteSignupPage() {
  const [step, setStep] = useState<Step>(1);
  const [formData, setFormData] = useState({
    gender: "",
    age: "",
    height: "",
    weight: "",
    dob: "",
  });

  const updateFormData = (data: Partial<typeof formData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const isStepValid = () => {
    if (step === 1) return formData.gender !== "";
    if (step === 2)
      return (
        formData.age !== "" && formData.height !== "" && formData.weight !== ""
      );
    if (step === 3) return formData.dob !== "";
    return true;
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6 md:p-8">
      {/* Container */}
      <div className="w-full max-w-[480px] space-y-8 animate-in fade-in duration-500">
        {/* Header - Matching Dashboard/Scanner Style */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-linear-to-br from-primary to-primary/60 shadow-lg shadow-primary/20">
            <UserPlus className="w-6 h-6 text-primary-foreground" />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              {step === 4 ? "All Caught Up!" : "Perfect your profile"}
            </h1>
            <p className="text-sm text-muted-foreground font-medium max-w-[300px]">
              {step === 4
                ? "Your information has been saved successfully."
                : "Help us customize your health and nutrition journey."}
            </p>
          </div>
        </div>

        {/* Step Progress Bar */}
        {step < 4 && (
          <div className="flex items-center gap-1.5 px-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={cn(
                  "h-1.5 flex-1 rounded-full transition-all duration-300",
                  step === i
                    ? "bg-primary"
                    : step > i
                      ? "bg-primary/30"
                      : "bg-muted",
                )}
              />
            ))}
          </div>
        )}

        {/* Form Card */}
        <div className="bg-card border border-border/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl p-8 space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                Step 01 — Identity
              </p>
              <div className="space-y-3">
                {[
                  { id: "male", label: "Male", icon: Mars },
                  { id: "female", label: "Female", icon: Venus },
                  { id: "other", label: "Other", icon: User },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => updateFormData({ gender: item.id })}
                    className={cn(
                      "w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200",
                      formData.gender === item.id
                        ? "border-primary bg-primary/2"
                        : "border-border/60 hover:border-primary/20 hover:bg-zinc-50 dark:hover:bg-zinc-900",
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
                          formData.gender === item.id
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted",
                        )}
                      >
                        <item.icon className="w-5 h-5" />
                      </div>
                      <span className="font-semibold">{item.label}</span>
                    </div>
                    {formData.gender === item.id && (
                      <Check className="w-5 h-5 text-primary" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                Step 02 — Physical Data
              </p>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider ml-1">
                    Current Age
                  </label>
                  <div className="relative group">
                    <TrendingUp className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <input
                      type="number"
                      placeholder="e.g. 25"
                      value={formData.age}
                      onChange={(e) => updateFormData({ age: e.target.value })}
                      className="w-full bg-muted/40 border border-border/60 rounded-xl py-3 pl-10 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider ml-1">
                      Height (cm)
                    </label>
                    <div className="relative group">
                      <Ruler className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <input
                        type="number"
                        placeholder="175"
                        value={formData.height}
                        onChange={(e) =>
                          updateFormData({ height: e.target.value })
                        }
                        className="w-full bg-muted/40 border border-border/60 rounded-xl py-3 pl-10 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider ml-1">
                      Weight (kg)
                    </label>
                    <div className="relative group">
                      <Scale className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <input
                        type="number"
                        placeholder="70"
                        value={formData.weight}
                        onChange={(e) =>
                          updateFormData({ weight: e.target.value })
                        }
                        className="w-full bg-muted/40 border border-border/60 rounded-xl py-3 pl-10 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                Step 03 — Birthday
              </p>
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider ml-1">
                  Date of Birth
                </label>
                <div className="relative group">
                  <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <input
                    type="date"
                    value={formData.dob}
                    onChange={(e) => updateFormData({ dob: e.target.value })}
                    className="w-full bg-muted/40 border border-border/60 rounded-xl py-3 pl-10 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
              </div>
              {formData.dob && (
                <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                  <p className="text-xs font-semibold text-primary flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    Confirmed. Your age profile is ready.
                  </p>
                </div>
              )}
            </div>
          )}

          {step === 4 && (
            <div className="flex flex-col items-center text-center py-4 space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <Check className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">
                  Profile optimized for <b>{formData.gender}</b>
                </p>
                <div className="flex gap-2 justify-center">
                  <span className="px-2 py-1 rounded bg-muted text-[10px] font-bold uppercase">
                    {formData.height} cm
                  </span>
                  <span className="px-2 py-1 rounded bg-muted text-[10px] font-bold uppercase">
                    {formData.weight} kg
                  </span>
                  <span className="px-2 py-1 rounded bg-muted text-[10px] font-bold uppercase">
                    {formData.age} years
                  </span>
                </div>
              </div>
              <button
                onClick={() => (window.location.href = "/nutrition/dashboard")}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-200 active:scale-[0.98]"
              >
                Go to Dashboard
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Navigation */}
          {step < 4 && (
            <div className="pt-2 flex gap-3">
              {step > 1 && (
                <button
                  onClick={() => setStep((s) => (s - 1) as Step)}
                  className="w-12 h-12 flex items-center justify-center rounded-xl border border-border/60 text-muted-foreground hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}
              <button
                onClick={() => setStep((s) => (s + 1) as Step)}
                disabled={!isStepValid()}
                className="flex-1 flex items-center justify-center gap-2 h-12 rounded-xl bg-primary text-primary-foreground text-[15px] font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
              >
                {step === 3 ? "Finish Setup" : "Continue"}
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-[11px] text-muted-foreground/40 font-bold uppercase tracking-[0.2em]">
          &copy; 2024 Zyra AI &bull; Health System
        </p>
      </div>
    </div>
  );
}
