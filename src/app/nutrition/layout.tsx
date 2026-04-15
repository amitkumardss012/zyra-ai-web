import { NutritionShell } from "./_components/nutrition-shell";

export const metadata = {
  title: "NutriScan AI — Smart Nutrition Tracker",
  description:
    "Upload food images, get instant AI-powered nutrition analysis including protein, carbs, fats, and more.",
};

export default function NutritionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <NutritionShell>{children}</NutritionShell>;
}
