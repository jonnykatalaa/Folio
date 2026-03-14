"use client";

import PortfolioOverview from "@/components/PortfolioOverview";
import MarketOverview from "@/components/MarketOverview";
import AssetTable from "@/components/AssetTable";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-1">Dashboard</h1>
        <p className="text-text-secondary text-sm">
          Your unified portfolio overview across all asset classes
        </p>
      </div>

      <PortfolioOverview />

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Market Summary</h2>
          <Link
            href="/markets"
            className="text-sm text-accent hover:text-accent-hover transition-colors flex items-center gap-1"
          >
            View All Markets <ArrowRight size={14} />
          </Link>
        </div>
        <MarketOverview />
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Trending Assets</h2>
          <Link
            href="/markets"
            className="text-sm text-accent hover:text-accent-hover transition-colors flex items-center gap-1"
          >
            See All <ArrowRight size={14} />
          </Link>
        </div>
        <div className="bg-surface border border-border rounded-xl overflow-hidden">
          <AssetTable limit={10} />
        </div>
      </div>
    </div>
  );
}
