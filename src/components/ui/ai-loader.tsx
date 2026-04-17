"use client";

import { useEffect, useState } from "react";
import { Sparkles, BrainCircuit, Zap, Search, Database, Cpu } from "lucide-react";
import { cn } from "@/lib/utils";

interface AILoaderProps {
  type?: "nutrition" | "beauty";
  className?: string;
}

const NUTRITION_MESSAGES = [
  "Analyzing your biometric data...",
  "Consulting nutritional databases...",
  "Calculating optimal macro ratios...",
  "Optimizing protein intake distribution...",
  "Balancing micronutrients and minerals...",
  "Curating meal recommendations...",
  "Finalizing your transformation strategy...",
];

const BEAUTY_MESSAGES = [
  "Analyzing skin profile and concerns...",
  "Scanning ingredient compatibility...",
  "Matching formulas to your skin type...",
  "Sequence optimizing routine steps...",
  "Selecting targeted active ingredients...",
  "Balancing pH and hydration levels...",
  "Crafting your personalized regimen...",
];

export function AILoader({ type = "nutrition", className }: AILoaderProps) {
  const [messageIndex, setMessageIndex] = useState(0);
  const messages = type === "nutrition" ? NUTRITION_MESSAGES : BEAUTY_MESSAGES;

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 800);
    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <div className={cn("flex flex-col items-center justify-center py-12 md:py-20 animate-in fade-in duration-700", className)}>
      <div className="relative">
        {/* Ambient Glows */}
        <div className="absolute -inset-8 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -inset-4 bg-secondary/10 rounded-full blur-2xl animate-pulse delay-700" />
        
        {/* Rotating Orbits */}
        <div className="absolute inset-0 flex items-center justify-center animate-orbit-fast">
            <div className="w-1.5 h-1.5 rounded-full bg-primary" style={{ transform: 'translateY(-40px)' }} />
        </div>
        <div className="absolute inset-0 flex items-center justify-center animate-orbit-slow" style={{ animationDirection: 'reverse' }}>
            <div className="w-2 h-2 rounded-full bg-secondary" style={{ transform: 'translateY(40px)' }} />
        </div>

        {/* Central Core */}
        <div className="relative w-24 h-24 rounded-3xl bg-card border border-primary/20 shadow-2xl shadow-primary/10 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-secondary/10 opacity-50" />
          
          {/* Animated Icons Transition */}
          <div className="relative z-10 flex flex-col items-center">
            {messageIndex % 4 === 0 && <BrainCircuit className="w-10 h-10 text-primary animate-in zoom-in duration-500" />}
            {messageIndex % 4 === 1 && <Database className="w-10 h-10 text-secondary animate-in zoom-in duration-500" />}
            {messageIndex % 4 === 2 && <Zap className="w-10 h-10 text-amber-500 animate-in zoom-in duration-500" />}
            {messageIndex % 4 === 3 && <Sparkles className="w-10 h-10 text-primary animate-in zoom-in duration-500" />}
          </div>

          {/* Scanning Line */}
          <div className="absolute inset-x-0 h-1/2 bg-linear-to-b from-transparent via-primary/20 to-transparent animate-scanning" />
        </div>

        {/* Floating Particles */}
        <div className="absolute -top-4 -right-4 w-8 h-8 rounded-full border border-primary/20 flex items-center justify-center bg-card shadow-lg animate-bounce">
            <Search className="w-4 h-4 text-primary" />
        </div>
        <div className="absolute -bottom-2 -left-4 w-10 h-10 rounded-full border border-secondary/20 flex items-center justify-center bg-card shadow-lg animate-pulse">
            <Cpu className="w-5 h-5 text-secondary" />
        </div>
      </div>

      {/* Text Content */}
      <div className="mt-10 text-center space-y-2">
        <h3 className="text-lg font-bold text-foreground">
          AI Engineer is Working
        </h3>
        <div className="h-6 flex items-center justify-center overflow-hidden">
           <p className="text-sm font-medium text-primary animate-in slide-in-from-bottom-2 duration-300" key={messageIndex}>
             {messages[messageIndex]}
           </p>
        </div>
        <p className="text-xs text-muted-foreground max-w-[280px] mx-auto leading-relaxed">
          Crafting your precision strategy using high-performance algorithms
        </p>
      </div>

      {/* Progress Bar Container */}
      <div className="w-64 h-1.5 bg-muted rounded-full mt-8 overflow-hidden relative">
         {/* Shimmer Effect */}
         <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent w-full h-full animate-[shimmer_2s_infinite]" style={{ backgroundSize: '200% 100%' }} />
         {/* Progress Fill */}
         <div className="absolute inset-y-0 left-0 bg-primary origin-left animate-[progress_4s_ease-in-out_forwards]" style={{ width: '100%' }} />
      </div>
    </div>
  );
}
