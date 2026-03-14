"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import AssetTable from "@/components/AssetTable";
import AssetTabs from "@/components/AssetTabs";
import { AssetClass } from "@/lib/types";
import { ASSETS } from "@/lib/data";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { BarChart3, Activity, Globe, Layers } from "lucide-react";

function MarketsContent() {
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get("tab") as AssetClass) || "all";
  const [activeTab, setActiveTab] = useState<AssetClass | "all">(initialTab);

  const filteredAssets =
    activeTab === "all"
      ? ASSETS
      : ASSETS.filter((a) => a.class === activeTab);

  const totalMarketCap = filteredAssets.reduce((sum, a) => sum + a.marketCap, 0);
  const totalVolume = filteredAssets.reduce((sum, a) => sum + a.volume24h, 0);
  const assetsCount = filteredAssets.length;
  const avgChange =
    filteredAssets.reduce((sum, a) => sum + a.change24h, 0) / assetsCount;

  const stats = [
    {
      label: "Total Market Cap",
      value: formatCurrency(totalMarketCap, true),
      icon: Globe,
    },
    {
      label: "24h Volume",
      value: formatCurrency(totalVolume, true),
      icon: Activity,
    },
    {
      label: "Assets",
      value: formatNumber(assetsCount),
      icon: Layers,
    },
    {
      label: "Avg 24h Change",
      value: `${avgChange >= 0 ? "+" : ""}${avgChange.toFixed(2)}%`,
      icon: BarChart3,
    },
  ];

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-1">Markets</h1>
        <p className="text-text-secondary text-sm">
          Explore prices across crypto, stocks, commodities, and forex
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-surface border border-border rounded-xl p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <stat.icon size={16} className="text-text-muted" />
              <span className="text-xs text-text-muted font-medium uppercase tracking-wider">
                {stat.label}
              </span>
            </div>
            <div className="text-lg font-bold">{stat.value}</div>
          </div>
        ))}
      </div>

      <AssetTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        <AssetTable assetClass={activeTab} />
      </div>
    </div>
  );
}

export default function MarketsPage() {
  return (
    <Suspense fallback={<div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6"><p className="text-text-muted">Loading markets...</p></div>}>
      <MarketsContent />
    </Suspense>
  );
}
