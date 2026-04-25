// "use server";

import { apiClient } from "@/api/api-client";
import { auth } from "../../auth";

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
