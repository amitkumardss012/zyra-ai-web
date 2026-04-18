"use client";

import React, { useState } from "react";
import { 
  Check, 
  Zap, 
  Crown, 
  Star, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight,
  TrendingUp,
  Flame,
  ScanLine
} from "lucide-react";
import { cn } from "@/lib/utils";

const PLANS = [
  {
    name: "Starter",
    price: { monthly: 0, yearly: 0 },
    description: "Essential tools for personal health tracking.",
    features: [
      "Basic Nutrition Tracking",
      "Daily Calorie Counter",
      "Manual Meal Logging",
      "Standard Dashboard",
      "Community Support"
    ],
    icon: Zap,
    buttonText: "Current Plan",
    highlight: false,
  },
  {
    name: "Pro",
    price: { monthly: 12, yearly: 9 },
    description: "Advanced AI-powered analysis for fast results.",
    features: [
      "Unlimited AI Food Scanning",
      "Detailed Macro Breakdown",
      "Personalized Goal Setting",
      "Weekly Progress Reports",
      "Custom Macro Ratios",
      "Advanced Trends & Insights"
    ],
    icon: Crown,
    buttonText: "Upgrade to Pro",
    highlight: true,
    tag: "Most Popular"
  },
  {
    name: "Elite",
    price: { monthly: 29, yearly: 24 },
    description: "Full potential for professional performance.",
    features: [
      "Everything in Pro",
      "1-on-1 AI Nutritionist",
      "Custom Meal Planning",
      "Priority AI Analysis",
      "Health Integration (Apple/Google)",
      "Exclusive Expert Articles"
    ],
    icon: Star,
    buttonText: "Go Elite",
    highlight: false,
  }
];

export default function SubscriptionPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  return (
    <div className="min-h-screen bg-background text-foreground py-12 px-6 md:px-12 lg:px-24">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            Pricing Plans
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
            Unlock your full <span className="text-primary italic">potential</span>
          </h1>
          <p className="text-lg text-muted-foreground font-medium">
            Choose the perfect plan to fuel your fitness journey with precision AI nutrition tracking.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 pt-4">
            <span className={cn("text-sm font-semibold transition-colors", billingCycle === "monthly" ? "text-foreground" : "text-muted-foreground")}>Monthly</span>
            <button 
              onClick={() => setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")}
              className="relative w-14 h-7 rounded-full bg-muted border border-border p-1 transition-all duration-300"
            >
              <div className={cn(
                "absolute top-1 left-1 w-5 h-5 rounded-full bg-primary shadow-lg shadow-primary/30 transition-all duration-300",
                billingCycle === "yearly" && "translate-x-7"
              )} />
            </button>
            <div className="flex items-center gap-2">
              <span className={cn("text-sm font-semibold transition-colors", billingCycle === "yearly" ? "text-foreground" : "text-muted-foreground")}>Yearly</span>
              <span className="px-2 py-0.5 rounded-full bg-linear-to-r from-secondary/20 to-secondary/10 border border-secondary/20 text-secondary text-[10px] font-black uppercase tracking-wider animate-pulse">Save 25%</span>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PLANS.map((plan, i) => (
            <div 
              key={plan.name}
              className={cn(
                "relative group flex flex-col p-8 rounded-[40px] border transition-all duration-500 hover:scale-[1.02]",
                plan.highlight 
                  ? "bg-card border-primary/30 shadow-[0_24px_60px_rgba(0,0,0,0.06)] ring-4 ring-primary/5 dark:ring-primary/10" 
                  : "bg-background border-border shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)]",
                "animate-in fade-in slide-in-from-bottom-8 duration-700"
              )}
              style={{ animationDelay: `${i * 150}ms` }}
            >
              {plan.tag && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1.5 rounded-full bg-primary text-primary-foreground text-[10px] font-black tracking-widest uppercase shadow-lg shadow-primary/30">
                  {plan.tag}
                </div>
              )}

              <div className="space-y-6 flex-1">
                <div className="space-y-4">
                  <div className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-500",
                    plan.highlight ? "bg-primary text-primary-foreground shadow-xl shadow-primary/20" : "bg-muted text-muted-foreground"
                  )}>
                    <plan.icon className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black tracking-tight">{plan.name}</h3>
                    <p className="text-sm text-muted-foreground font-medium mt-1">{plan.description}</p>
                  </div>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black tracking-tighter">$</span>
                  <span className="text-6xl font-black tracking-tighter">
                    {billingCycle === "monthly" ? plan.price.monthly : plan.price.yearly}
                  </span>
                  <span className="text-muted-foreground font-bold tracking-tight">/mo</span>
                </div>

                <ul className="space-y-4 pt-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-4 text-sm font-semibold tracking-tight">
                      <div className="mt-1 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                        <Check className="w-3 h-3" />
                      </div>
                      <span className="text-foreground/80">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-10">
                <button className={cn(
                  "w-full py-5 rounded-3xl text-sm font-black uppercase tracking-widest transition-all active:scale-[0.97] group-hover:shadow-xl",
                  plan.highlight 
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-primary/40" 
                    : "bg-muted text-foreground hover:bg-border/60 shadow-sm"
                )}>
                  {plan.buttonText}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Features Comparison Highlights */}
        <div className="pt-12 text-center space-y-8">
          <h2 className="text-sm font-black uppercase tracking-[0.4em] text-muted-foreground/50">Trusted features for better results</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "High Precision AI", icon: ScanLine },
              { label: "Data Security", icon: ShieldCheck },
              { label: "Goal Oriented", icon: Flame },
              { label: "Advanced Charts", icon: TrendingUp },
            ].map((feature) => (
              <div key={feature.label} className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center text-muted-foreground">
                  <feature.icon className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{feature.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ - Quick Section */}
        <div className="max-w-3xl mx-auto pt-16 space-y-10">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-black tracking-tight">Frequently Asked Questions</h2>
            <p className="text-sm text-muted-foreground font-medium">Everything you need to know about our plans.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            {[
              { q: "Can I cancel anytime?", a: "Yes, you can cancel your subscription at any time from your settings page." },
              { q: "How accurate is the AI scanning?", a: "Our AI is 95% accurate for whole foods and standard recipes." },
              { q: "Is there a free trial?", a: "Yes, the Starter plan is free forever. Elite features can be trialed for 7 days." },
              { q: "Do you offer student discounts?", a: "We offer a 50% discount for validated students. Contact support." },
            ].map((faq) => (
              <div key={faq.q} className="space-y-2">
                <h3 className="text-sm font-bold text-foreground tracking-tight">{faq.q}</h3>
                <p className="text-[13px] text-muted-foreground leading-relaxed font-medium">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="relative overflow-hidden rounded-[50px] bg-card border border-border/50 p-12 text-center space-y-6">
          <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-primary via-secondary to-primary" />
          <h2 className="text-3xl font-black tracking-tighter">Ready to transform your life?</h2>
          <p className="text-muted-foreground font-medium max-w-lg mx-auto">
            Join thousands of users who have optimized their nutrition and reached their goals with Zyra AI.
          </p>
          <button className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-primary text-primary-foreground font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/25 hover:shadow-primary/40 transition-all hover:scale-105 active:scale-95">
            Get Started Now
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Footer info */}
        <div className="text-center text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 pt-12 pb-8">
          All transactions are secure and encrypted &bull; 2024 Zyra Health Systems
        </div>
      </div>
    </div>
  );
}
