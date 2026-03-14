import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import MobileNav from "@/components/MobileNav";
import TickerBar from "@/components/TickerBar";
import { PortfolioProvider } from "@/context/PortfolioContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PortfolioTracker - Unified Asset Tracker",
  description:
    "Track your entire portfolio across crypto, stocks, commodities, and cash in one place.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <PortfolioProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <TickerBar />
            <main className="flex-1 pb-20 md:pb-8">{children}</main>
            <MobileNav />
          </div>
        </PortfolioProvider>
      </body>
    </html>
  );
}
