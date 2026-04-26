"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { scanFoodAction } from "@/actions/nutrition.action";
import { showError, showSuccess } from "@/utils/message";

interface ScanResult {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  healthScore: number;
  tags: string[];
}

interface ScanContextType {
  isScanning: boolean;
  isNotificationOpen: boolean;
  lastResult: ScanResult | null;
  lastImage: string | null;
  startScan: (imageBase64: string, mealType: string) => Promise<void>;
  resetScan: () => void;
  dismissNotification: () => void;
}

const ScanContext = createContext<ScanContextType | undefined>(undefined);

export function ScanProvider({ children }: { children: React.ReactNode }) {
  const [isScanning, setIsScanning] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [lastResult, setLastResult] = useState<ScanResult | null>(null);
  const [lastImage, setLastImage] = useState<string | null>(null);

  const startScan = useCallback(async (imageBase64: string, mealType: string) => {
    if (isScanning) return;

    setIsScanning(true);
    setIsNotificationOpen(true);
    setLastImage(imageBase64);
    setLastResult(null);

    try {
      const formData = new FormData();
      formData.append("image", imageBase64);
      formData.append("mealType", mealType);

      const data = await scanFoodAction(formData);

      if (data) {
        setLastResult(data);
        showSuccess(`Scan Complete: ${data.name} identified!`);
      }
    } catch (error) {
      showError(error);
      setIsNotificationOpen(false);
    } finally {
      setIsScanning(false);
    }
  }, [isScanning]);

  const resetScan = () => {
    setLastResult(null);
    setLastImage(null);
    setIsScanning(false);
    setIsNotificationOpen(false);
  };

  const dismissNotification = () => {
    setIsNotificationOpen(false);
  };

  return (
    <ScanContext.Provider value={{ 
      isScanning, 
      isNotificationOpen, 
      lastResult, 
      lastImage,
      startScan, 
      resetScan, 
      dismissNotification 
    }}>
      {children}
    </ScanContext.Provider>
  );
}

export function useScan() {
  const context = useContext(ScanContext);
  if (context === undefined) {
    throw new Error("useScan must be used within a ScanProvider");
  }
  return context;
}
