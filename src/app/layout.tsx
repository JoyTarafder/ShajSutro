import type { Metadata } from "next";
import "./globals.css";
import ToastProvider from "@/components/ui/ToastProvider";

export const metadata: Metadata = {
  title: {
    default: "ShajSutro",
    template: "%s | ShajSutro",
  },
  description:
    "Thoughtfully crafted clothing for the modern wardrobe. Minimalist designs, premium materials, enduring style.",
  keywords: ["clothing", "fashion", "minimalist", "ShajSutro", "sustainable"],
  openGraph: {
    title: "ShajSutro",
    description: "Thoughtfully crafted clothing for the modern wardrobe.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        {children}
        <ToastProvider />
      </body>
    </html>
  );
}
