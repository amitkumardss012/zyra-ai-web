"use client";

import { api } from "@/api/api";
import { cn } from "@/lib/utils";
import { showError, showSuccess } from "@/utils/message";
import {
  ArrowRight,
  Calendar,
  Check,
  ChevronLeft,
  ChevronRight,
  Mars,
  Ruler,
  Scale,
  Sparkles,
  TrendingUp,
  User,
  UserPlus,
  Venus,
  Zap,
} from "lucide-react";
import { useState } from "react";

type Step = 1 | 2 | 3; // Step 3 is Success

export default function CompleteOnboardingPage() {
  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    gender: "" as "MALE" | "FEMALE" | "OTHER" | "PREFER_NOT_TO_SAY" | "",
    age: "",
    height: "",
    weight: "",
    dob: "",
    preferredMode: "" as "NUTRITION" | "BEAUTY" | "",
  });

  const updateFormData = (data: Partial<typeof formData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const isStepValid = () => {
    if (step === 1) {
      return (
        formData.gender !== "" &&
        formData.age !== "" &&
        formData.height !== "" &&
        formData.weight !== "" &&
        formData.dob !== ""
      );
    }
    if (step === 2) {
      return formData.preferredMode !== "";
    }
    return true;
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        ...formData,
        age: parseInt(formData.age),
        height: parseFloat(formData.height),
        weight: parseFloat(formData.weight),
        dob: new Date(formData.dob),
      };

      const res = await api.put("/user/profile", payload);
      if (res.data.success) {
        showSuccess("Profile completed successfully!");
        setStep(3);
      }
    } catch (error) {
      showError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6 md:p-8">
      {/* Container */}
      <div className="w-full max-w-[520px] space-y-8 animate-in fade-in duration-500">
        {/* Header */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-linear-to-br from-primary to-primary/60 shadow-xl shadow-primary/20">
            <UserPlus className="w-7 h-7 text-primary-foreground" />
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              {step === 3 ? "Welcome Aboard!" : "Complete Your Profile"}
            </h1>
            <p className="text-sm text-muted-foreground font-medium max-w-[340px]">
              {step === 3
                ? "Your journey with Zyra AI starts now."
                : "A few more details to personalize your AI experience."}
            </p>
          </div>
        </div>

        {/* Progress Stepper */}
        {step < 3 && (
          <div className="flex items-center justify-between px-2 gap-4">
            {[1, 2].map((i) => (
              <div key={i} className="flex-1 flex flex-col gap-2">
                <div
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-500",
                    step === i
                      ? "bg-primary w-full"
                      : step > i
                      ? "bg-primary/30 w-full"
                      : "bg-muted w-full"
                  )}
                />
                <span className={cn(
                  "text-[10px] font-bold uppercase tracking-wider text-center",
                  step === i ? "text-primary" : "text-muted-foreground/60"
                )}>
                  Step 0{i}: {i === 1 ? "Bio Data" : "AI Mode"}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Content Card */}
        <div className="bg-card border border-border/50 shadow-2xl shadow-black/5 dark:shadow-white/5 rounded-3xl p-8 space-y-6 relative overflow-hidden">
          {step === 1 && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              {/* Gender Selection */}
              <div className="space-y-3">
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest ml-1">
                  Select Gender
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: "MALE", label: "Male", icon: Mars },
                    { id: "FEMALE", label: "Female", icon: Venus },
                    { id: "OTHER", label: "Other", icon: User },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => updateFormData({ gender: item.id as any })}
                      className={cn(
                        "flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-200",
                        formData.gender === item.id
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-border/40 hover:border-primary/20 hover:bg-muted/30"
                      )}
                    >
                      <item.icon className={cn("w-6 h-6", formData.gender === item.id ? "animate-pulse" : "")} />
                      <span className="text-xs font-bold">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Physical Details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2">
                  <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest ml-1">
                    Age
                  </label>
                  <div className="relative group">
                    <TrendingUp className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <input
                      type="number"
                      placeholder="e.g. 25"
                      value={formData.age}
                      onChange={(e) => updateFormData({ age: e.target.value })}
                      className="w-full bg-muted/30 border border-border/40 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest ml-1">
                    Height (cm)
                  </label>
                  <div className="relative group">
                    <Ruler className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <input
                      type="number"
                      placeholder="175"
                      value={formData.height}
                      onChange={(e) => updateFormData({ height: e.target.value })}
                      className="w-full bg-muted/30 border border-border/40 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest ml-1">
                    Weight (kg)
                  </label>
                  <div className="relative group">
                    <Scale className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <input
                      type="number"
                      placeholder="70"
                      value={formData.weight}
                      onChange={(e) => updateFormData({ weight: e.target.value })}
                      className="w-full bg-muted/30 border border-border/40 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2 col-span-2">
                  <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest ml-1">
                    Date of Birth
                  </label>
                  <div className="relative group">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <input
                      type="date"
                      value={formData.dob}
                      onChange={(e) => updateFormData({ dob: e.target.value })}
                      className="w-full bg-muted/30 border border-border/40 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <div className="space-y-4">
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest ml-1 text-center block">
                  Choose Your Preferred AI Mode
                </label>
                <div className="grid grid-cols-1 gap-4">
                  {[
                    {
                      id: "NUTRITION",
                      label: "Nutrition AI",
                      description: "Scan meals, track calories, and plan your diet.",
                      icon: Zap,
                      color: "from-orange-500/20 to-red-500/20",
                      borderColor: "border-orange-500/50",
                      textColor: "text-orange-500",
                    },
                    {
                      id: "BEAUTY",
                      label: "Beauty AI",
                      description: "Skin analysis, skincare routines, and makeup tips.",
                      icon: Sparkles,
                      color: "from-pink-500/20 to-purple-500/20",
                      borderColor: "border-pink-500/50",
                      textColor: "text-pink-500",
                    },
                  ].map((mode) => (
                    <button
                      key={mode.id}
                      onClick={() => updateFormData({ preferredMode: mode.id as any })}
                      className={cn(
                        "relative group flex items-start gap-4 p-5 rounded-2xl border-2 transition-all duration-300 text-left",
                        formData.preferredMode === mode.id
                          ? cn("bg-linear-to-br shadow-lg", mode.color, mode.borderColor)
                          : "border-border/40 hover:border-primary/20 hover:bg-muted/30"
                      )}
                    >
                      <div className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors",
                        formData.preferredMode === mode.id ? "bg-white/20" : "bg-muted"
                      )}>
                        <mode.icon className={cn("w-6 h-6", formData.preferredMode === mode.id ? "text-foreground" : "text-muted-foreground")} />
                      </div>
                      <div className="space-y-1">
                        <span className={cn("font-bold text-base", formData.preferredMode === mode.id ? "text-foreground" : "")}>
                          {mode.label}
                        </span>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {mode.description}
                        </p>
                      </div>
                      {formData.preferredMode === mode.id && (
                        <div className="absolute top-4 right-4">
                          <div className="w-5 h-5 rounded-full bg-foreground flex items-center justify-center">
                            <Check className="w-3 h-3 text-background stroke-3" />
                          </div>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col items-center text-center py-6 space-y-8 animate-in zoom-in-95 duration-500">
              <div className="relative">
                <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center text-primary animate-bounce">
                  <Check className="w-10 h-10" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full animate-ping opacity-20" />
              </div>
              
              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-xl font-bold">Profile Optimized</h3>
                  <p className="text-sm text-muted-foreground">
                    Zyra AI is now calibrated to your personal bio-data.
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-2 justify-center">
                  {[
                    `${formData.age} yrs`,
                    `${formData.height}cm`,
                    `${formData.weight}kg`,
                    formData.preferredMode.charAt(0) + formData.preferredMode.slice(1).toLowerCase()
                  ].map((tag) => (
                    <span key={tag} className="px-3 py-1.5 rounded-full bg-muted/50 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => (window.location.href = `/${formData.preferredMode.toLowerCase()}/dashboard`)}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-primary text-primary-foreground text-base font-bold shadow-2xl shadow-primary/30 hover:shadow-primary/50 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                Enter Your Dashboard
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Navigation Controls */}
          {step < 3 && (
            <div className="pt-4 flex gap-4">
              {step === 2 && (
                <button
                  onClick={() => setStep(1)}
                  className="w-14 h-14 flex items-center justify-center rounded-2xl border-2 border-border/40 text-muted-foreground hover:bg-muted/30 transition-all hover:border-primary/20"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              )}
              <button
                onClick={() => {
                  if (step === 1) setStep(2);
                  else handleSubmit();
                }}
                disabled={!isStepValid() || loading}
                className="flex-1 flex items-center justify-center gap-3 h-14 rounded-2xl bg-primary text-primary-foreground text-base font-bold shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                ) : (
                  <>
                    {step === 2 ? "Finalize Profile" : "Continue to Mode Selection"}
                    <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="flex flex-col items-center gap-4">
          <p className="text-[10px] text-muted-foreground/40 font-bold uppercase tracking-[0.3em]">
            &copy; 2024 Zyra AI &bull; Intelligent Wellness
          </p>
          <div className="flex gap-6">
            <span className="w-1 h-1 rounded-full bg-primary/20" />
            <span className="w-1 h-1 rounded-full bg-primary/20" />
            <span className="w-1 h-1 rounded-full bg-primary/20" />
          </div>
        </div>
      </div>
    </div>
  );
}
