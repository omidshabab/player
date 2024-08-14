import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import "@/styles/globals.css";
import { cn } from "@/lib/utils";

const font = Bricolage_Grotesque({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "player, by omidshabab.",
  description: "player.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(font.className, "antialiased")}>{children}</body>
    </html>
  );
}
