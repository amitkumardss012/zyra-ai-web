"use client";

import { useState, useRef, useCallback } from "react";
import {
  ScanLine,
  Upload,
  Camera,
  X,
  Loader2,
  Sparkles,
  Drumstick,
  Wheat,
  Droplets,
  Flame,
  ChevronDown,
  ImagePlus,
  RotateCcw,
  Check,
  Info,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { scanFoodAction } from "@/actions/nutrition.action";
import { showError, showSuccess } from "@/utils/message";

/* ─── Types ─── */
interface NutrientResult {
  name: string;
  amount: string;
  unit: string;
  dailyValue: number;
  color: string;
}

interface FoodResult {
  name: string;
  servingSize: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber: number;
  sugar: number;
  sodium: number;
  cholesterol: number;
  nutrients: NutrientResult[];
  healthScore: number;
  tags: string[];
}

export default function ScannerPage() {
  const [dragOver, setDragOver] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<FoodResult | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
      setResult(null);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleAnalyze = async () => {
    if (!preview) return;
    
    setAnalyzing(true);
    try {
      const formData = new FormData();
      formData.append("image", preview);
      formData.append("mealType", "LUNCH");

      const data = await scanFoodAction(formData);
      
      if (data) {
        // Map the flat backend data to the frontend's expected format
        const mappedResult: FoodResult = {
          name: data.name,
          servingSize: data.servingSize || "N/A",
          calories: data.calories,
          protein: data.protein,
          carbs: data.carbs,
          fats: data.fats,
          fiber: data.fiber || 0,
          sugar: data.sugar || 0,
          sodium: data.sodium || 0,
          cholesterol: data.cholesterol || 0,
          healthScore: data.healthScore,
          tags: data.tags,
          nutrients: [
            { name: "Vitamin A", amount: data.vitaminA?.toString() || "0", unit: "mcg", dailyValue: Math.round((data.vitaminA || 0) / 9), color: "from-amber-400 to-orange-500" },
            { name: "Vitamin C", amount: data.vitaminC?.toString() || "0", unit: "mg", dailyValue: Math.round((data.vitaminC || 0) / 0.9), color: "from-yellow-400 to-amber-500" },
            { name: "Vitamin B6", amount: data.vitaminB6?.toString() || "0", unit: "mg", dailyValue: Math.round((data.vitaminB6 || 0) / 0.017), color: "from-violet-400 to-purple-500" },
            { name: "Iron", amount: data.iron?.toString() || "0", unit: "mg", dailyValue: Math.round((data.iron || 0) / 0.18), color: "from-red-400 to-rose-500" },
            { name: "Potassium", amount: data.potassium?.toString() || "0", unit: "mg", dailyValue: Math.round((data.potassium || 0) / 47), color: "from-emerald-400 to-green-500" },
            { name: "Calcium", amount: data.calcium?.toString() || "0", unit: "mg", dailyValue: Math.round((data.calcium || 0) / 13), color: "from-blue-400 to-indigo-500" },
          ].filter(n => parseFloat(n.amount) > 0)
        };
        
        setResult(mappedResult);
        showSuccess("Analysis complete!");
      }
    } catch (error) {
      showError(error);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleReset = () => {
    setPreview(null);
    setResult(null);
    setShowDetails(false);
  };

  return (
    <div className="px-4 md:px-8 py-6 md:py-8 max-w-[1200px] mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-linear-to-br from-primary to-primary/60 shadow-lg shadow-primary/20">
            <ScanLine className="w-5 h-5 text-primary-foreground" />
          </div>
          Food Scanner
        </h1>
        <p className="text-sm text-muted-foreground mt-2 ml-[52px]">
          Upload or capture a photo of your food — AI will analyze its
          nutritional content instantly
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ─── Upload Area ─── */}
        <div className="space-y-4">
          {!preview ? (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "relative group cursor-pointer rounded-2xl border-2 border-dashed p-8 flex flex-col items-center justify-center min-h-[360px] transition-all duration-300",
                dragOver
                  ? "border-primary bg-primary/5 scale-[1.02]"
                  : "border-border/60 bg-card hover:border-primary/40 hover:bg-primary/2"
              )}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFile(file);
                }}
              />
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-primary/10 to-primary/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <ImagePlus className="w-8 h-8 text-primary/60 group-hover:text-primary transition-colors duration-300" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
                    <Sparkles className="w-3 h-3 text-primary-foreground" />
                  </div>
                </div>
                <div className="text-center space-y-1">
                  <p className="text-sm font-semibold text-foreground">
                    Drop your food photo here
                  </p>
                  <p className="text-xs text-muted-foreground">
                    or click to browse • PNG, JPG, WEBP supported
                  </p>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/15 transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    Upload
                  </button>
                  <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-muted text-muted-foreground text-xs font-semibold hover:bg-muted/80 transition-colors">
                    <Camera className="w-3.5 h-3.5" />
                    Camera
                  </button>
                </div>
              </div>

              {/* Decorative corner marks */}
              <div className="absolute top-4 left-4 w-6 h-6 border-l-2 border-t-2 border-primary/20 rounded-tl-lg" />
              <div className="absolute top-4 right-4 w-6 h-6 border-r-2 border-t-2 border-primary/20 rounded-tr-lg" />
              <div className="absolute bottom-4 left-4 w-6 h-6 border-l-2 border-b-2 border-primary/20 rounded-bl-lg" />
              <div className="absolute bottom-4 right-4 w-6 h-6 border-r-2 border-b-2 border-primary/20 rounded-br-lg" />
            </div>
          ) : (
            <div className="relative rounded-2xl overflow-hidden border border-border/50 bg-card">
              {/* Image preview */}
              <div className="relative aspect-4/3 bg-muted/20">
                <img
                  src={preview}
                  alt="Food preview"
                  className="w-full h-full object-cover"
                />
                {analyzing && (
                  <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full border-2 border-primary/20 flex items-center justify-center">
                        <Loader2 className="w-7 h-7 text-primary animate-spin" />
                      </div>
                      <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary animate-spin" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-semibold text-foreground">
                        Analyzing food...
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        AI is identifying nutrients
                      </p>
                    </div>
                  </div>
                )}
                {/* Action buttons */}
                <div className="absolute top-3 right-3 flex gap-2">
                  <button
                    onClick={handleReset}
                    className="w-8 h-8 rounded-lg bg-background/80 backdrop-blur-sm border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              {/* Analyze button */}
              {!result && (
                <div className="p-4">
                  <button
                    onClick={handleAnalyze}
                    disabled={analyzing}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-200 active:scale-[0.98] disabled:opacity-50"
                  >
                    {analyzing ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Sparkles className="w-4 h-4" />
                    )}
                    {analyzing ? "Analyzing..." : "Analyze with AI"}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Quick tips */}
          {!preview && (
            <div className="rounded-xl bg-muted/30 border border-border/30 p-4">
              <p className="text-xs font-bold text-foreground mb-2 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-accent" />
                Tips for best results
              </p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Use good lighting and take a clear photo</li>
                <li>• Include all items on the plate in the frame</li>
                <li>• Avoid blurry or dark images</li>
                <li>• Close-up shots work best for multiple items</li>
              </ul>
            </div>
          )}
        </div>

        {/* ─── Results Panel ─── */}
        <div className="space-y-4">
          {result ? (
            <>
              {/* Food name & health score */}
              <div className="rounded-2xl border border-border/50 bg-card p-5 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-primary" />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                        Identified
                      </span>
                    </div>
                    <h2 className="text-lg font-bold text-foreground leading-tight">
                      {result.name}
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      Serving: {result.servingSize}
                    </p>
                  </div>
                  <div className="flex flex-col items-center">
                    <div
                      className={cn(
                        "w-14 h-14 rounded-xl flex items-center justify-center font-bold text-lg",
                        result.healthScore >= 80
                          ? "bg-primary/10 text-primary"
                          : result.healthScore >= 60
                          ? "bg-secondary/10 text-secondary"
                          : "bg-destructive/10 text-destructive"
                      )}
                    >
                      {result.healthScore}
                    </div>
                    <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider mt-1">
                      Health
                    </span>
                  </div>
                </div>
                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {result.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2 py-0.5 rounded-md bg-primary/5 text-[10px] font-semibold text-primary border border-primary/10"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Macro breakdown */}
              <div className="rounded-2xl border border-border/50 bg-card p-5">
                <h3 className="text-sm font-bold text-foreground mb-4">
                  Macro Breakdown
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    {
                      label: "Calories",
                      value: result.calories,
                      unit: "kcal",
                      icon: Flame,
                      gradient: "from-primary to-primary/60",
                    },
                    {
                      label: "Protein",
                      value: result.protein,
                      unit: "g",
                      icon: Drumstick,
                      gradient: "from-emerald-500 to-green-500",
                    },
                    {
                      label: "Carbs",
                      value: result.carbs,
                      unit: "g",
                      icon: Wheat,
                      gradient: "from-secondary to-secondary/60",
                    },
                    {
                      label: "Fats",
                      value: result.fats,
                      unit: "g",
                      icon: Droplets,
                      gradient: "from-accent to-accent/60",
                    },
                  ].map((macro) => (
                    <div
                      key={macro.label}
                      className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border/30"
                    >
                      <div
                        className={cn(
                          "w-9 h-9 rounded-lg flex items-center justify-center bg-linear-to-br shadow-md",
                          macro.gradient
                        )}
                      >
                        <macro.icon className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-lg font-bold text-foreground leading-none">
                          {macro.value}
                          <span className="text-xs font-normal text-muted-foreground ml-0.5">
                            {macro.unit}
                          </span>
                        </p>
                        <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
                          {macro.label}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Additional macros */}
                <div className="grid grid-cols-4 gap-2 mt-3">
                  {[
                    { label: "Fiber", value: `${result.fiber}g` },
                    { label: "Sugar", value: `${result.sugar}g` },
                    { label: "Sodium", value: `${result.sodium}mg` },
                    { label: "Cholest.", value: `${result.cholesterol}mg` },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="text-center p-2 rounded-lg bg-muted/20"
                    >
                      <p className="text-sm font-bold text-foreground">
                        {item.value}
                      </p>
                      <p className="text-[9px] text-muted-foreground font-semibold uppercase tracking-wider">
                        {item.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Micronutrients expandable */}
              <div className="rounded-2xl border border-border/50 bg-card overflow-hidden">
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-muted/20 transition-colors"
                >
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-secondary" />
                    Vitamins & Minerals
                  </h3>
                  <ChevronDown
                    className={cn(
                      "w-4 h-4 text-muted-foreground transition-transform duration-200",
                      showDetails && "rotate-180"
                    )}
                  />
                </button>
                {showDetails && (
                  <div className="px-5 pb-5 space-y-2 animate-in slide-in-from-top-2 duration-200">
                    {result.nutrients.map((n) => (
                      <div
                        key={n.name}
                        className="flex items-center gap-3 p-2.5 rounded-xl bg-muted/20"
                      >
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-semibold text-foreground">
                              {n.name}
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                              {n.amount}
                              {n.unit} ({n.dailyValue}% DV)
                            </span>
                          </div>
                          <div className="h-1 rounded-full bg-muted/50 overflow-hidden">
                            <div
                              className={cn(
                                "h-full rounded-full bg-linear-to-r",
                                n.color
                              )}
                              style={{
                                width: `${Math.min(n.dailyValue, 100)}%`,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-200 active:scale-[0.98]">
                  <Plus className="w-4 h-4" />
                  Add to Log
                </button>
                <button
                  onClick={handleReset}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-border text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-all duration-200"
                >
                  <RotateCcw className="w-4 h-4" />
                  Scan Again
                </button>
              </div>
            </>
          ) : (
            /* Placeholder state */
            <div className="rounded-2xl border border-dashed border-border/50 bg-card/50 p-8 flex flex-col items-center justify-center min-h-[400px]">
              <div className="w-16 h-16 rounded-2xl bg-muted/30 flex items-center justify-center mb-4">
                <ScanLine className="w-7 h-7 text-muted-foreground/40" />
              </div>
              <p className="text-sm font-semibold text-muted-foreground text-center">
                Upload a food image to see
                <br />
                detailed nutrition analysis
              </p>
              <p className="text-xs text-muted-foreground/60 mt-2 text-center max-w-[240px]">
                Our AI will identify the food and provide comprehensive
                nutritional information
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
