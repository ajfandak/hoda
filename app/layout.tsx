import type { Metadata } from "next";
import { GeistSans } from 'geist/font/sans'; // ایمپورت صحیح
import { GeistMono } from 'geist/font/mono'; // ایمپورت صحیح
import "./globals.css";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Hoda Platform",
  description: "AI Chat Application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* 
        متغیرهای فونت باید به این شکل به body اضافه شوند
        تا در کل برنامه در دسترس باشند.
      */}
      <body className={cn(
          "font-sans antialiased",
          GeistSans.variable, 
          GeistMono.variable
        )}
      >
        {children}
      </body>
    </html>
  );
}
