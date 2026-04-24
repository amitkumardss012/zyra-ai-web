"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Bell, Moon, Sun } from "lucide-react";

export function ProfileToggles() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="divide-y divide-border/30">
      {/* Notifications */}
      <div className="flex items-center justify-between px-5 py-3.5 hover:bg-muted/20 transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center">
            <Bell className="w-4 h-4 text-muted-foreground" />
          </div>
          <div>
            <p className="text-xs font-semibold text-foreground">
              Notifications
            </p>
            <p className="text-[10px] text-muted-foreground">
              Meal reminders & daily reports
            </p>
          </div>
        </div>
        <button
          onClick={() => setNotifications(!notifications)}
          className={cn(
            "w-10 h-6 rounded-full transition-all duration-200 relative",
            notifications ? "bg-primary" : "bg-muted"
          )}
        >
          <div
            className={cn(
              "w-4 h-4 rounded-full bg-white shadow-sm absolute top-1 transition-all duration-200",
              notifications ? "left-5" : "left-1"
            )}
          />
        </button>
      </div>

      {/* Dark Mode */}
      <div className="flex items-center justify-between px-5 py-3.5 hover:bg-muted/20 transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center">
            {darkMode ? (
              <Moon className="w-4 h-4 text-muted-foreground" />
            ) : (
              <Sun className="w-4 h-4 text-muted-foreground" />
            )}
          </div>
          <div>
            <p className="text-xs font-semibold text-foreground">
              Dark Mode
            </p>
            <p className="text-[10px] text-muted-foreground">
              Toggle theme appearance
            </p>
          </div>
        </div>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={cn(
            "w-10 h-6 rounded-full transition-all duration-200 relative",
            darkMode ? "bg-primary" : "bg-muted"
          )}
        >
          <div
            className={cn(
              "w-4 h-4 rounded-full bg-white shadow-sm absolute top-1 transition-all duration-200",
              darkMode ? "left-5" : "left-1"
            )}
          />
        </button>
      </div>
    </div>
  );
}
