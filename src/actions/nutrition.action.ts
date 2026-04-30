// "use server";

import { apiClient } from "@/api/api-client";

/**
 * Server action to scan food image.
 * Uses FormData to bypass Next.js serialization limits for large base64 strings.
 */
export const scanFoodAction = async (formData: FormData) => {
  try {
    // const session = await auth();
    // const token = session?.user?.id;

    const image = formData.get("image") as string;
    const mealType = formData.get("mealType") as string;

    const res = await apiClient.post(
      "/nutrition/scan-food",
      { image, mealType }
    );

    return res.data.data;
  } catch (error) {
    console.error("Error in scanFoodAction:", error);
    throw error;
  }
};

export const getNutritionLogsAction = async (params?: {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
}) => {
  try {
    const res = await apiClient.get("/nutrition/logs", { params });
    return res.data.data;
  } catch (error) {
    console.error("Error in getNutritionLogsAction:", error);
    throw error;
  }
};

export const getPlansAction = async (params?: {
  page?: number;
  limit?: number;
}) => {
  try {
    const res = await apiClient.get("/nutrition/plans", { params });
    return res.data.data;
  } catch (error) {
    console.error("Error in getPlansAction:", error);
    throw error;
  }
};
