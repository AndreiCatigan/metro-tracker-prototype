/* eslint-disable @next/next/no-page-custom-font */
import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/lib/AppContext";

export const metadata: Metadata = {
  title: "track ME tro - Leyte Bus Transit",
  description: "Dual-app transit ecosystem for buses in Leyte",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased font-sans">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-surface text-on-surface pt-safe pb-safe">
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
