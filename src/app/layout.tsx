
import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "CoSpace | Encuentra tu espacio ideal",
    template: "%s | CoSpace",
  },
  description:
    "Reserva escritorios, salas de reuniones y espacios de trabajo en CoSpace.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <Suspense
          fallback={
            <header className="sticky top-0 z-50 h-20 border-b border-[#243D35]/10 bg-[#F4F1E8]/95" />
          }
        >
          <Navbar />
        </Suspense>

        <main className="flex-1">{children}</main>

        <Footer />
      </body>
    </html>
  );
}
