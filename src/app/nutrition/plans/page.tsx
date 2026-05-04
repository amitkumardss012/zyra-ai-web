"use client";

import { getPlansAction } from "@/actions/nutrition.action";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  Activity,
  AlertCircle,
  ArrowLeft,
  Calendar,
  CalendarHeart,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ChevronRight as ChevronRightIcon,
  ClipboardList,
  Coffee,
  Droplets,
  Dumbbell,
  Flame,
  Lightbulb,
  Loader2,
  Moon,
  Search,
  Trophy,
  UtensilsCrossed,
  Zap
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface DietMeal {
  day: string;
  breakfast: string;
  lunch: string;
  dinner: string;
}

interface WorkoutDay {
  day: string;
  exercises: {
    name: string;
    duration: string;
  }[];
}

interface TransformationPlan {
  id: string;
  goal: string;
  description: string;
  durationDays: number;
  dailyCalories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatsGrams: number;
  status: string;
  createdAt: string;
  dietSchedule?: DietMeal[];
  workoutRoutine?: WorkoutDay[];
  guidelines?: {
    toEat: string[];
    toAvoid: string[];
    tips: string[];
  };
}

export default function PlansPage() {
  const [plans, setPlans] = useState<TransformationPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<TransformationPlan | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const fetchPlans = async (page = 1) => {
    setLoading(true);
    try {
      const data = await getPlansAction({
        page,
        limit: 10
      });
      setPlans(data.plans);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Failed to fetch plans:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans(1);
  }, []);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchPlans(newPage);
    }
  };

  return (
    <div className="px-4 md:px-8 py-6 md:py-8 max-w-[1200px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/nutrition/dashboard"
            className="p-2 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              Your Plans
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              All your AI-generated transformation plans
            </p>
          </div>
        </div>

        <Link
          href="/nutrition/planner"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all"
        >
          <Zap className="w-4 h-4" />
          New Plan
        </Link>
      </div>

      {/* Content */}
      {loading ? (
        <div className="min-h-[400px] flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : plans.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="group relative rounded-2xl border border-border/50 bg-card p-6 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 transition-all duration-300 flex flex-col"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider",
                      plan.status === "ACTIVE" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                    )}>
                      {plan.status}
                    </span>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                      {format(new Date(plan.createdAt), "MMM d, yyyy")}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-foreground leading-tight mt-2">
                    {plan.goal}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-1 flex-1">
                    {plan.description || "Personalized transformation plan tailored to your goals."}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-primary" />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {[
                  { label: "Calories", value: plan.dailyCalories, unit: "kcal" },
                  { label: "Protein", value: plan.proteinGrams, unit: "g" },
                  { label: "Carbs", value: plan.carbsGrams, unit: "g" },
                  { label: "Fats", value: plan.fatsGrams, unit: "g" },
                ].map((macro) => (
                  <div key={macro.label} className="p-3 rounded-xl bg-muted/30 border border-border/30 text-center">
                    <p className="text-lg font-bold text-foreground">{macro.value}</p>
                    <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">{macro.label}</p>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 mt-auto border-t border-border/50">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span className="text-sm font-bold text-foreground">{plan.durationDays} Days</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-secondary" />
                    <span className="text-sm font-bold text-foreground">Advanced</span>
                  </div>
                </div>

                <button 
                  onClick={() => setSelectedPlan(plan)}
                  className="flex items-center gap-1 text-xs font-bold text-primary group-hover:gap-2 transition-all"
                >
                  View Full Plan
                  <ChevronRightIcon className="w-4 h-4" />
                </button>
              </div>

              {/* Decorative gradient overlay */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-linear-to-bl from-primary/5 to-transparent rounded-tr-2xl -z-10" />
            </div>
          ))}
        </div>
      ) : (
        <div className="min-h-[400px] flex flex-col items-center justify-center text-center p-8 rounded-3xl border-2 border-dashed border-border/50 bg-card/50">
          <div className="w-16 h-16 rounded-2xl bg-muted/30 flex items-center justify-center mb-4">
            <ClipboardList className="w-8 h-8 text-muted-foreground/30" />
          </div>
          <h3 className="text-lg font-bold text-foreground">No plans yet</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-[280px]">
            Ready to transform? Let our AI generate a personalized nutrition and workout plan for you.
          </p>
          <Link
            href="/nutrition/planner"
            className="mt-6 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all"
          >
            Create Your First Plan
          </Link>
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 pt-6">
          <button
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
            className="p-2 rounded-xl bg-card border border-border disabled:opacity-50 hover:bg-muted transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="text-sm font-bold">
            Page <span className="text-primary">{pagination.page}</span> of {pagination.totalPages}
          </div>
          <button
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.totalPages}
            className="p-2 rounded-xl bg-card border border-border disabled:opacity-50 hover:bg-muted transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Plan Detail Modal */}
      <Dialog open={!!selectedPlan} onOpenChange={(open) => !open && setSelectedPlan(null)}>
        <DialogContent className="sm:max-w-[750px] w-[95vw] p-0 overflow-hidden border-none bg-[#0a0a0a] rounded-[2.5rem] shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)]">
          {selectedPlan && (
            <div className="flex flex-col max-h-[90vh]">
              {/* Modal Header Banner - Premium Mesh Design */}
              <div className="relative p-10 pb-8 overflow-hidden">
                <div className="absolute inset-0 bg-[#0a0a0a]" />
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -mr-32 -mt-32 opacity-60" />
                <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-secondary/10 rounded-full blur-[100px] -ml-20 -mb-20 opacity-40" />
                
                <div className="relative z-10 flex flex-col gap-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-black uppercase tracking-[0.25em] text-primary">
                         <Zap className="w-3.5 h-3.5" />
                         {selectedPlan.durationDays} Day Program
                      </div>
                      <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.25em] text-white/40">
                         <CalendarHeart className="w-3.5 h-3.5" />
                         Phase 01
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl group hover:bg-white/10 transition-all duration-300">
                      <div className="relative">
                        <div className="w-2 h-2 rounded-full bg-primary animate-ping absolute inset-0" />
                        <div className="w-2 h-2 rounded-full bg-primary relative" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/80">{selectedPlan.status}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <DialogHeader className="p-0 text-left">
                      <DialogTitle className="text-5xl font-black tracking-tighter text-white leading-[0.95] max-w-[90%]">
                        {selectedPlan.goal}
                      </DialogTitle>
                    </DialogHeader>
                    <p className="text-base text-white/50 max-w-[500px] font-medium leading-relaxed">
                      {selectedPlan.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Custom Tabs Switcher */}
              <Tabs defaultValue="overview" className="flex-1 flex flex-col min-h-0">
                <div className="px-8 pb-4">
                  <TabsList className="bg-white/5 border border-white/5 rounded-2xl p-1 gap-1">
                    <TabsTrigger 
                      value="overview" 
                      className="rounded-xl px-6 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold text-xs transition-all"
                    >
                      Overview
                    </TabsTrigger>
                    <TabsTrigger 
                      value="diet" 
                      className="rounded-xl px-6 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold text-xs transition-all"
                    >
                      Diet Plan
                    </TabsTrigger>
                    <TabsTrigger 
                      value="workout" 
                      className="rounded-xl px-6 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold text-xs transition-all"
                    >
                      Workout
                    </TabsTrigger>
                  </TabsList>
                </div>

                <div className="flex-1 overflow-y-auto px-8 pb-10 space-y-8 custom-scrollbar">
                  {/* Overview Tab */}
                  <TabsContent value="overview" className="mt-0 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    {/* Stats Grid - Premium Cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {[
                        { label: "Daily Target", value: selectedPlan.dailyCalories, unit: "kcal", icon: Flame, color: "text-orange-500", bg: "bg-orange-500/10", border: "border-orange-500/20" },
                        { label: "Total Protein", value: `${selectedPlan.proteinGrams}g`, unit: "", icon: Trophy, color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
                        { label: "Total Carbs", value: `${selectedPlan.carbsGrams}g`, unit: "", icon: Activity, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20" },
                        { label: "Total Fats", value: `${selectedPlan.fatsGrams}g`, unit: "", icon: Droplets, color: "text-purple-500", bg: "bg-purple-500/10", border: "border-purple-500/20" },
                      ].map(stat => (
                        <div key={stat.label} className={cn("relative group p-6 rounded-[2rem] bg-white/3 border backdrop-blur-xl flex flex-col items-center text-center gap-2 transition-all hover:bg-white/6 hover:-translate-y-1 duration-500", stat.border)}>
                          <div className={cn("p-3 rounded-2xl mb-2 group-hover:scale-110 transition-transform duration-500", stat.bg)}>
                            <stat.icon className={cn("w-5 h-5", stat.color)} />
                          </div>
                          <div className="text-3xl font-black tracking-tighter text-white">{stat.value}</div>
                          <div className="text-[9px] font-black opacity-30 uppercase tracking-[0.25em]">{stat.label}</div>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* To Eat */}
                      <div className="p-8 rounded-[2.5rem] bg-emerald-500/5 border border-emerald-500/10">
                        <h4 className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] text-emerald-500/80 mb-6">
                          <CheckCircle2 className="w-4 h-4" />
                          Recommended Foods
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedPlan.guidelines?.toEat?.map((food, i) => (
                            <span key={i} className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/10 text-[10px] font-bold text-emerald-500/90">
                              {food}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* To Avoid */}
                      <div className="p-8 rounded-[2.5rem] bg-rose-500/5 border border-rose-500/10">
                        <h4 className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] text-rose-500/80 mb-6">
                          <AlertCircle className="w-4 h-4" />
                          Foods to Avoid
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedPlan.guidelines?.toAvoid?.map((food, i) => (
                            <span key={i} className="px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/10 text-[10px] font-bold text-rose-500/90">
                              {food}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="relative group p-8 rounded-[2.5rem] bg-linear-to-br from-amber-500/8 to-transparent border border-amber-500/10 overflow-hidden">
                       <div className="absolute -bottom-8 -right-8 opacity-5 group-hover:scale-110 transition-transform duration-700">
                         <Lightbulb className="w-32 h-32 text-amber-500" />
                       </div>
                       <h4 className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] text-amber-500/80 mb-4">
                         <Zap className="w-4 h-4" />
                         AI Expert Strategy
                       </h4>
                       <div className="grid grid-cols-1 gap-3">
                          {selectedPlan.guidelines?.tips?.map((tip, i) => (
                            <div key={i} className="text-xs text-white/60 leading-relaxed flex items-start gap-3">
                               <div className="mt-1.5 w-1 h-1 rounded-full bg-amber-500/40 shrink-0" />
                               {tip}
                            </div>
                          ))}
                       </div>
                    </div>
                  </TabsContent>

                  {/* Diet Tab - Card Design */}
                  <TabsContent value="diet" className="mt-0 space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-4">
                     {selectedPlan.dietSchedule?.map((row, i) => (
                        <div key={i} className="group rounded-[2.5rem] bg-white/2 border border-white/8 overflow-hidden hover:bg-white/4 hover:border-primary/20 transition-all duration-300">
                           {/* Day Header */}
                           <div className="bg-white/5 px-8 py-4 border-b border-white/8 flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                 <div className="w-2 h-2 rounded-full bg-primary" />
                                 <span className="text-xs font-black uppercase tracking-[0.3em] text-white/90">{row.day}</span>
                              </div>
                              <div className="flex gap-1.5">
                                 {[1, 2, 3].map(dot => (
                                    <div key={dot} className="w-1 h-1 rounded-full bg-white/20" />
                                 ))}
                              </div>
                           </div>
                           
                           {/* Meals Grid */}
                           <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/8">
                              {/* Breakfast */}
                              <div className="p-8 space-y-4 hover:bg-primary/2 transition-colors">
                                 <div className="flex items-center gap-3 text-[10px] font-black text-primary uppercase tracking-[0.2em]">
                                    <div className="p-2 rounded-xl bg-primary/10">
                                       <Coffee className="w-3.5 h-3.5" />
                                    </div>
                                    Breakfast
                                 </div>
                                 <p className="text-sm font-medium text-white/70 leading-relaxed group-hover:text-white/90 transition-colors">
                                    {row.breakfast}
                                 </p>
                              </div>

                              {/* Lunch */}
                              <div className="p-8 space-y-4 hover:bg-primary/2 transition-colors">
                                 <div className="flex items-center gap-3 text-[10px] font-black text-primary uppercase tracking-[0.2em]">
                                    <div className="p-2 rounded-xl bg-primary/10">
                                       <UtensilsCrossed className="w-3.5 h-3.5" />
                                    </div>
                                    Lunch
                                 </div>
                                 <p className="text-sm font-medium text-white/70 leading-relaxed group-hover:text-white/90 transition-colors">
                                    {row.lunch}
                                 </p>
                              </div>

                              {/* Dinner */}
                              <div className="p-8 space-y-4 hover:bg-primary/2 transition-colors">
                                 <div className="flex items-center gap-3 text-[10px] font-black text-primary uppercase tracking-[0.2em]">
                                    <div className="p-2 rounded-xl bg-primary/10">
                                       <Moon className="w-3.5 h-3.5" />
                                    </div>
                                    Dinner
                                  </div>
                                 <p className="text-sm font-medium text-white/70 leading-relaxed group-hover:text-white/90 transition-colors">
                                    {row.dinner}
                                 </p>
                              </div>
                           </div>
                        </div>
                     ))}
                  </TabsContent>

                   {/* Workout Tab - Modern Layout */}
                   <TabsContent value="workout" className="mt-0 space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-4">
                      {selectedPlan.workoutRoutine?.map((day, i) => (
                         <div key={i} className="group p-8 rounded-[2.5rem] bg-white/2 border border-white/8 hover:bg-white/4 hover:border-secondary/20 transition-all duration-300">
                            <div className="flex items-center justify-between mb-8">
                               <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                                     <Dumbbell className="w-6 h-6 text-secondary" />
                                  </div>
                                  <div>
                                     <h5 className="text-xl font-black text-white tracking-tight">{day.day}</h5>
                                     <p className="text-[10px] font-black text-secondary/60 uppercase tracking-[0.2em]">Active Recovery & Protocol</p>
                                  </div>
                               </div>
                               <div className="px-4 py-1.5 rounded-xl bg-white/5 border border-white/8 text-[10px] font-black uppercase tracking-widest text-white/40">
                                  Day {i + 1}
                               </div>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                               {day.exercises?.map((ex, j) => (
                                  <div key={j} className="flex items-center justify-between p-6 rounded-[1.5rem] bg-white/3 border border-white/5 hover:border-secondary/30 transition-all group/ex">
                                     <div className="space-y-1">
                                        <p className="text-sm font-bold text-white/90 group-hover/ex:text-white transition-colors">{ex.name}</p>
                                        <div className="flex items-center gap-2">
                                           <div className="w-1 h-1 rounded-full bg-secondary/40" />
                                           <p className="text-[10px] text-white/40 font-medium">Standard Protocol</p>
                                        </div>
                                     </div>
                                     <div className="text-right">
                                        <p className="text-xs font-black text-secondary">{ex.duration}</p>
                                        <p className="text-[8px] font-bold text-white/20 uppercase tracking-widest">Duration</p>
                                     </div>
                                  </div>
                               ))}
                            </div>
                         </div>
                      ))}
                   </TabsContent>
                </div>
              </Tabs>
              
              {/* Floating Close Icon instead of bulky footer */}
              <button 
                onClick={() => setSelectedPlan(null)}
                className="absolute top-8 right-8 p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white/50 hover:text-white transition-all"
              >
                <Search className="w-5 h-5 rotate-45" />
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
