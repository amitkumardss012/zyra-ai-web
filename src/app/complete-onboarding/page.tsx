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

const DIETARY_OPTIONS = ["Vegan", "Vegetarian", "Keto", "Paleo", "Gluten-Free", "Low-Carb", "Dairy-Free"];
const ALLERGY_OPTIONS = ["Peanuts", "Shellfish", "Dairy", "Gluten", "Soy", "Tree Nuts"];
const NUTRITION_GOALS = ["Weight Loss", "Muscle Gain", "Maintenance", "Improved Energy", "Better Sleep"];
const SKIN_CONCERNS = ["Acne", "Aging", "Pigmentation", "Sensitivity", "Dryness", "Texture"];
const BEAUTY_GOALS = ["Hydration", "Glow", "Anti-aging", "Acne Control", "Even Tone"];

export default function CompleteOnboardingPage() {
  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    preferredMode: "" as "NUTRITION" | "BEAUTY" | "",
    gender: "" as "MALE" | "FEMALE" | "OTHER" | "PREFER_NOT_TO_SAY" | "",
    dob: "",
    age: "",
    // Nutrition specific
    height: "",
    weight: "",
    activityLevel: "" as "SEDENTARY" | "LIGHTLY_ACTIVE" | "MODERATELY_ACTIVE" | "VERY_ACTIVE" | "EXTRA_ACTIVE" | "",
    dietaryPreferences: [] as string[],
    allergies: [] as string[],
    // Beauty specific
    skinType: "" as "OILY" | "DRY" | "COMBINATION" | "SENSITIVE" | "NORMAL" | "",
    skinConcerns: [] as string[],
    // Shared / Contextual
    healthGoals: [] as string[], // Used for both but with different options
    beautyGoals: [] as string[],
  });

  const updateFormData = (data: Partial<typeof formData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const toggleSelection = (field: keyof typeof formData, value: string) => {
    const current = formData[field] as string[];
    if (current.includes(value)) {
      updateFormData({ [field]: current.filter((v) => v !== value) });
    } else {
      updateFormData({ [field]: [...current, value] });
    }
  };

  const isStepValid = () => {
    if (step === 1) {
      return formData.preferredMode !== "" && formData.gender !== "" && formData.dob !== "";
    }
    if (step === 2) {
      if (formData.preferredMode === "NUTRITION") {
        return (
          formData.age !== "" &&
          formData.height !== "" &&
          formData.weight !== "" &&
          formData.activityLevel !== ""
        );
      }
      if (formData.preferredMode === "BEAUTY") {
        return formData.age !== "" && formData.skinType !== "";
      }
    }
    return true;
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload: any = {
        preferredMode: formData.preferredMode,
        gender: formData.gender,
        dob: new Date(formData.dob),
        age: parseInt(formData.age),
      };

      if (formData.preferredMode === "NUTRITION") {
        payload.height = parseFloat(formData.height);
        payload.weight = parseFloat(formData.weight);
        payload.activityLevel = formData.activityLevel;
        payload.dietaryPreferences = formData.dietaryPreferences;
        payload.allergies = formData.allergies;
        payload.healthGoals = formData.healthGoals;
      } else {
        payload.skinType = formData.skinType;
        payload.skinConcerns = formData.skinConcerns;
        payload.beautyGoals = formData.beautyGoals;
      }

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
      <div className="w-full max-w-[560px] space-y-8 animate-in fade-in duration-500">
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
                : "Help us tailor your experience."}
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
                  {i === 1 ? "Core Selection" : "Personalized Specs"}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="bg-card border border-border/50 shadow-2xl rounded-3xl p-8 space-y-6 relative overflow-hidden">
          {step === 1 && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              {/* Mode Selection */}
              <div className="space-y-3">
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest ml-1">
                  Choose Your Path
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { id: "NUTRITION", label: "Nutrition AI", icon: Zap, color: "from-orange-500/20 to-red-500/20" },
                    { id: "BEAUTY", label: "Beauty AI", icon: Sparkles, color: "from-pink-500/20 to-purple-500/20" },
                  ].map((mode) => (
                    <button
                      key={mode.id}
                      onClick={() => updateFormData({ preferredMode: mode.id as any })}
                      className={cn(
                        "flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all duration-200 text-center",
                        formData.preferredMode === mode.id
                          ? cn("border-primary bg-linear-to-br", mode.color)
                          : "border-border/40 hover:border-primary/20 hover:bg-muted/30"
                      )}
                    >
                      <mode.icon className="w-8 h-8" />
                      <span className="text-sm font-bold">{mode.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Gender & DOB */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2">
                  <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest ml-1">
                    Gender Identity
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "MALE", label: "Male", icon: Mars },
                      { id: "FEMALE", label: "Female", icon: Venus },
                      { id: "OTHER", label: "Other", icon: User },
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => updateFormData({ gender: item.id as any })}
                        className={cn(
                          "flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 transition-all",
                          formData.gender === item.id
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-border/40 hover:border-primary/20"
                        )}
                      >
                        <item.icon className="w-4 h-4" />
                        <span className="text-xs font-bold">{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 col-span-2">
                  <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest ml-1">
                    Birthday
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
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
              <div className="space-y-2">
                 <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest ml-1">
                  Current Age
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

              {formData.preferredMode === "NUTRITION" ? (
                <div className="space-y-6">
                  {/* Physical Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Height (cm)</label>
                      <input
                        type="number"
                        placeholder="175"
                        value={formData.height}
                        onChange={(e) => updateFormData({ height: e.target.value })}
                        className="w-full bg-muted/30 border border-border/40 rounded-2xl py-3 pr-4 pl-4 text-sm font-semibold focus:border-primary outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Weight (kg)</label>
                      <input
                        type="number"
                        placeholder="70"
                        value={formData.weight}
                        onChange={(e) => updateFormData({ weight: e.target.value })}
                        className="w-full bg-muted/30 border border-border/40 rounded-2xl py-3 pr-4 pl-4 text-sm font-semibold focus:border-primary outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Activity Level */}
                  <div className="space-y-3">
                    <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Activity Level</label>
                    <div className="grid grid-cols-1 gap-2">
                      {[
                        { id: "SEDENTARY", label: "Sedentary", desc: "Little to no exercise" },
                        { id: "LIGHTLY_ACTIVE", label: "Lightly Active", desc: "1-3 days/week" },
                        { id: "MODERATELY_ACTIVE", label: "Moderately Active", desc: "3-5 days/week" },
                        { id: "VERY_ACTIVE", label: "Very Active", desc: "6-7 days/week" },
                        { id: "EXTRA_ACTIVE", label: "Extra Active", desc: "Physical job or 2x training" },
                      ].map((level) => (
                        <button
                          key={level.id}
                          onClick={() => updateFormData({ activityLevel: level.id as any })}
                          className={cn(
                            "flex items-center justify-between p-3 rounded-xl border-2 transition-all",
                            formData.activityLevel === level.id ? "border-primary bg-primary/5" : "border-border/40"
                          )}
                        >
                          <div className="text-left">
                            <p className="text-xs font-bold">{level.label}</p>
                            <p className="text-[10px] text-muted-foreground">{level.desc}</p>
                          </div>
                          {formData.activityLevel === level.id && <Check className="w-4 h-4 text-primary" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Multi-selects */}
                  {[
                    { label: "Dietary Preferences", field: "dietaryPreferences", options: DIETARY_OPTIONS },
                    { label: "Allergies", field: "allergies", options: ALLERGY_OPTIONS },
                    { label: "Health Goals", field: "healthGoals", options: NUTRITION_GOALS },
                  ].map((group) => (
                    <div key={group.field} className="space-y-3">
                      <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest ml-1">{group.label}</label>
                      <div className="flex flex-wrap gap-2">
                        {group.options.map((opt) => (
                          <button
                            key={opt}
                            onClick={() => toggleSelection(group.field as any, opt)}
                            className={cn(
                              "px-3 py-1.5 rounded-full text-xs font-semibold transition-all border",
                              (formData[group.field as keyof typeof formData] as string[]).includes(opt)
                                ? "bg-primary text-primary-foreground border-primary"
                                : "bg-muted text-muted-foreground border-transparent hover:bg-muted/80"
                            )}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Skin Type */}
                  <div className="space-y-3">
                    <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest ml-1 text-center block">Skin Type</label>
                    <div className="grid grid-cols-3 gap-2">
                      {["NORMAL", "OILY", "DRY", "COMBINATION", "SENSITIVE"].map((type) => (
                        <button
                          key={type}
                          onClick={() => updateFormData({ skinType: type as any })}
                          className={cn(
                            "py-2 rounded-xl border-2 text-[10px] font-bold transition-all",
                            formData.skinType === type ? "border-primary bg-primary/5 text-primary" : "border-border/40"
                          )}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Multi-selects for Beauty */}
                  {[
                    { label: "Skin Concerns", field: "skinConcerns", options: SKIN_CONCERNS },
                    { label: "Beauty Goals", field: "beautyGoals", options: BEAUTY_GOALS },
                  ].map((group) => (
                    <div key={group.field} className="space-y-3">
                      <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest ml-1">{group.label}</label>
                      <div className="flex flex-wrap gap-2">
                        {group.options.map((opt) => (
                          <button
                            key={opt}
                            onClick={() => toggleSelection(group.field as any, opt)}
                            className={cn(
                              "px-3 py-1.5 rounded-full text-xs font-semibold transition-all border",
                              (formData[group.field as keyof typeof formData] as string[]).includes(opt)
                                ? "bg-primary text-primary-foreground border-primary"
                                : "bg-muted text-muted-foreground border-transparent hover:bg-muted/80"
                            )}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col items-center text-center py-6 space-y-8 animate-in zoom-in-95 duration-500">
              <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center text-primary animate-bounce">
                <Check className="w-10 h-10" />
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-bold">Profile Optimized</h3>
                <p className="text-sm text-muted-foreground">Calibration complete. Your AI is ready.</p>
              </div>
              <button
                onClick={() => (window.location.href = `/${formData.preferredMode.toLowerCase()}/dashboard`)}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-primary text-primary-foreground text-base font-bold shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Enter Your Dashboard
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {step < 3 && (
            <div className="pt-4 flex gap-4">
              {step === 2 && (
                <button
                  onClick={() => setStep(1)}
                  className="w-14 h-14 flex items-center justify-center rounded-2xl border-2 border-border/40 text-muted-foreground hover:bg-muted/30 transition-all"
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
                className="flex-1 flex items-center justify-center gap-3 h-14 rounded-2xl bg-primary text-primary-foreground text-base font-bold shadow-xl disabled:opacity-50 transition-all active:scale-[0.98]"
              >
                {loading ? <div className="w-6 h-6 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" /> : (
                  <>
                    {step === 2 ? "Finalize Profile" : "Continue to Details"}
                    <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
