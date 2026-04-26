"use client";

import { useScan } from "@/providers/scan-provider";
import { Loader2, Sparkles, CheckCircle2, X, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export function ScanStatusIndicator() {
  const { isScanning, lastResult, isNotificationOpen, dismissNotification } = useScan();
  const router = useRouter();

  if (!isNotificationOpen) return null;

  const handleView = () => {
    router.push("/nutrition/scanner");
    // Optionally dismiss after viewing, but user asked for "until user himself close it"
    // So we'll keep it open unless they click close.
  };

  return (
    <div className="fixed bottom-6 right-6 z-100 animate-in slide-in-from-bottom-4 duration-300">
      <div className={cn(
        "flex flex-col gap-3 p-4 rounded-3xl border shadow-2xl backdrop-blur-md transition-all duration-500 min-w-[280px]",
        isScanning 
          ? "bg-primary/10 border-primary/20 text-primary" 
          : "bg-emerald-500/10 border-emerald-500/20 text-emerald-600"
      )}>
        <div className="flex items-center gap-4">
          <div className="relative">
            {isScanning ? (
              <>
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Loader2 className="w-5 h-5 animate-spin" />
                </div>
                <div className="absolute -top-1 -right-1">
                  <Sparkles className="w-3 h-3 animate-pulse" />
                </div>
              </>
            ) : (
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
            )}
          </div>
          
          <div className="flex-1 space-y-0.5 pr-2">
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-70">
              {isScanning ? "Background Task" : "Analysis Complete"}
            </p>
            <p className="text-sm font-bold truncate max-w-[180px]">
              {isScanning ? "Analyzing your food..." : `${lastResult?.name}`}
            </p>
          </div>

          {!isScanning && (
            <button 
              onClick={dismissNotification}
              className="p-1.5 rounded-lg hover:bg-emerald-500/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Completion Actions */}
        {!isScanning && lastResult && (
          <div className="flex items-center gap-2 mt-1 animate-in fade-in slide-in-from-top-1 duration-300">
            <button
              onClick={handleView}
              className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all active:scale-[0.98]"
            >
              <Eye className="w-3.5 h-3.5" />
              View Results
            </button>
            <button
              onClick={dismissNotification}
              className="px-4 py-2 rounded-xl border border-emerald-500/20 text-emerald-600 text-xs font-bold hover:bg-emerald-500/10 transition-all"
            >
              Close
            </button>
          </div>
        )}

        {/* Progress Bar (Only while scanning) */}
        {isScanning && (
          <div className="h-1 w-full bg-primary/10 rounded-full overflow-hidden mt-1">
            <div className="h-full bg-primary animate-progress" />
          </div>
        )}
      </div>
    </div>
  );
}
