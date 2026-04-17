import { BeautyShell } from "./_components/beauty-shell";

export const metadata = {
  title: "AuraScan AI — Smart Beauty & Skincare",
  description:
    "Scan your makeup products, get instant AI-powered ingredient analysis, benefits, and hidden harmful chemicals.",
};

export default function BeautyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <BeautyShell>{children}</BeautyShell>;
}
