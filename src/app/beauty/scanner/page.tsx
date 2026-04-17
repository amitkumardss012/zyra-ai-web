"use client";

import { useState, useRef, useCallback } from "react";
import {
  Upload,
  Camera,
  X,
  Loader2,
  Sparkles,
  Droplet,
  ChevronDown,
  ImagePlus,
  RotateCcw,
  Check,
  Info,
  Plus,
  AlertTriangle,
  Leaf,
  ScanHeart
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ─── Types ─── */
interface ChemicalResult {
  name: string;
  status: "Safe" | "Warning" | "Harmful";
  description: string;
  color: string;
}

interface ProductResult {
  name: string;
  category: string;
  purityScore: number;
  tags: string[];
  chemicals: ChemicalResult[];
  benefits: string[];
  harms: string[];
}

/* ─── Mock AI Result ─── */
const MOCK_RESULT: ProductResult = {
  name: "Radiant Skin Foundation FPS 20",
  category: "Makeup • Foundation",
  purityScore: 65,
  tags: ["Hydrating", "Matte Finish", "Has Parabens"],
  benefits: [
    "Provides long-lasting hydration",
    "Evens out skin tone perfectly",
    "Contains SPF for sun protection",
    "Doesn't clog pores (Non-comedogenic)"
  ],
  harms: [
    "Contains preservatives that may irritate sensitive skin",
    "Synthetic fragrances might cause allergic reactions",
    "May disrupt natural oil production if used daily"
  ],
  chemicals: [
    { name: "Hyaluronic Acid", status: "Safe", description: "Deeply hydrating and safe for all skin types.", color: "from-emerald-400 to-green-500" },
    { name: "Titanium Dioxide", status: "Safe", description: "Effective physical sunscreen agent.", color: "from-emerald-400 to-green-500" },
    { name: "Propylparaben", status: "Warning", description: "Preservative; potential endocrine disruptor.", color: "from-amber-400 to-orange-500" },
    { name: "Fragrance (Parfum)", status: "Warning", description: "Undisclosed mixture; common allergen.", color: "from-amber-400 to-orange-500" },
    { name: "Phthalates", status: "Harmful", description: "Used for consistency; linked to health risks.", color: "from-red-400 to-rose-500" }
  ],
};

export default function BeautyScannerPage() {
  const [dragOver, setDragOver] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<ProductResult | null>(null);
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

  const handleAnalyze = () => {
    setAnalyzing(true);
    // Simulate AI analysis
    setTimeout(() => {
      setResult(MOCK_RESULT);
      setAnalyzing(false);
    }, 2500);
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
            <ScanHeart className="w-5 h-5 text-primary-foreground" />
          </div>
          Product Scanner
        </h1>
        <p className="text-sm text-muted-foreground mt-2 ml-[52px]">
          Upload a photo of your makeup or skincare ingredients list — AI will analyze it instantly
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
                    Drop your product photo here
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
                  alt="Product preview"
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
                        Analyzing product...
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        AI is identifying chemicals & ingredients
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
                <li>• Take a clear photo of the ingredients label</li>
                <li>• Ensure the text is readable and well-lit</li>
                <li>• Avoid blurriness or heavy shadows</li>
                <li>• Zoom in if the text is very small</li>
              </ul>
            </div>
          )}
        </div>

        {/* ─── Results Panel ─── */}
        <div className="space-y-4">
          {result ? (
            <>
              {/* Product name & score */}
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
                      {result.category}
                    </p>
                  </div>
                  <div className="flex flex-col items-center">
                    <div
                      className={cn(
                        "w-14 h-14 rounded-xl flex items-center justify-center font-bold text-lg",
                        result.purityScore >= 80
                          ? "bg-primary/10 text-primary"
                          : result.purityScore >= 50
                          ? "bg-secondary/10 text-secondary"
                          : "bg-destructive/10 text-destructive"
                      )}
                    >
                      {result.purityScore}
                    </div>
                    <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider mt-1">
                      Purity
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

              {/* Benefits & Harms */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-border/50 bg-card p-5">
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2 mb-3">
                    <Leaf className="w-4 h-4 text-emerald-500" />
                    Benefits
                  </h3>
                  <ul className="space-y-2">
                    {result.benefits.map((benefit, i) => (
                      <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                        <span className="text-emerald-500 mt-0.5">•</span>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-2xl border border-border/50 bg-card p-5">
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2 mb-3">
                    <AlertTriangle className="w-4 h-4 text-destructive" />
                    Potential Harms
                  </h3>
                  <ul className="space-y-2">
                    {result.harms.map((harm, i) => (
                      <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                        <span className="text-destructive mt-0.5">•</span>
                        {harm}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Chemicals List */}
              <div className="rounded-2xl border border-border/50 bg-card overflow-hidden">
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-muted/20 transition-colors"
                >
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <Droplet className="w-4 h-4 text-secondary" />
                    Ingredients Analysis
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
                    {result.chemicals.map((c) => (
                      <div
                        key={c.name}
                        className="flex flex-col gap-1 p-3 rounded-xl bg-muted/20"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-foreground">
                            {c.name}
                          </span>
                          <span className={cn(
                            "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full",
                            c.status === "Safe" ? "bg-emerald-500/10 text-emerald-500" :
                            c.status === "Warning" ? "bg-amber-500/10 text-amber-500" :
                            "bg-destructive/10 text-destructive"
                          )}>
                            {c.status}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {c.description}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-200 active:scale-[0.98]">
                  <Plus className="w-4 h-4" />
                  Add to Routine
                </button>
                <button
                  onClick={handleReset}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-border text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-all duration-200"
                >
                  <RotateCcw className="w-4 h-4" />
                  Scan Another
                </button>
              </div>
            </>
          ) : (
            /* Placeholder state */
            <div className="rounded-2xl border border-dashed border-border/50 bg-card/50 p-8 flex flex-col items-center justify-center min-h-[400px]">
              <div className="w-16 h-16 rounded-2xl bg-muted/30 flex items-center justify-center mb-4">
                <ScanHeart className="w-7 h-7 text-muted-foreground/40" />
              </div>
              <p className="text-sm font-semibold text-muted-foreground text-center">
                Upload a product image to see
                <br />
                its chemical breakdown
              </p>
              <p className="text-xs text-muted-foreground/60 mt-2 text-center max-w-[240px]">
                Our AI will identify the ingredients and tell you the benefits and potential harms
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
