"use client";

import { ASSETS } from "@/lib/data";
import { formatCurrency, formatPercent, getChangeColor, getAssetClassColor, getAssetClassLabel } from "@/lib/utils";
import Link from "next/link";
import { ArrowRight, TrendingUp, TrendingDown, Activity } from "lucide-react";

export default function MarketOverview() {
  const topGainers = [...ASSETS]
    .sort((a, b) => b.change24h - a.change24h)
    .slice(0, 4);

  const topLosers = [...ASSETS]
    .sort((a, b) => a.change24h - b.change24h)
    .slice(0, 4);

  const topVolume = [...ASSETS]
    .sort((a, b) => b.volume24h - a.volume24h)
    .slice(0, 4);

  const classSummary = ["crypto", "stocks", "commodities", "cash"].map((cls) => {
    const classAssets = ASSETS.filter((a) => a.class === cls);
    const avgChange =
      classAssets.reduce((sum, a) => sum + a.change24h, 0) / classAssets.length;
    return {
      class: cls,
      label: getAssetClassLabel(cls),
      count: classAssets.length,
      avgChange,
      color: getAssetClassColor(cls),
    };
  });

  const sections = [
    { title: "Top Gainers", icon: TrendingUp, data: topGainers, color: "text-green" },
    { title: "Top Losers", icon: TrendingDown, data: topLosers, color: "text-red" },
    { title: "Highest Volume", icon: Activity, data: topVolume, color: "text-accent" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {classSummary.map((cls) => (
          <Link
            key={cls.class}
            href={`/markets?tab=${cls.class}`}
            className="bg-surface border border-border rounded-xl p-4 hover:border-border/80 hover:bg-surface-hover transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: cls.color }}
                />
                <span className="text-sm font-medium">{cls.label}</span>
              </div>
              <ArrowRight
                size={14}
                className="text-text-muted group-hover:text-text-primary transition-colors"
              />
            </div>
            <div className="text-lg font-bold">{cls.count} assets</div>
            <div className={`text-sm font-medium mt-1 ${getChangeColor(cls.avgChange)}`}>
              Avg {formatPercent(cls.avgChange)}
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {sections.map((section) => (
          <div
            key={section.title}
            className="bg-surface border border-border rounded-xl p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <section.icon size={18} className={section.color} />
              <h3 className="font-semibold text-sm">{section.title}</h3>
            </div>
            <div className="space-y-3">
              {section.data.map((asset, i) => (
                <Link
                  key={asset.id}
                  href={`/asset/${asset.id}`}
                  className="flex items-center justify-between py-2 border-b border-border/50 last:border-0 hover:opacity-80 transition-opacity"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-text-muted w-4">{i + 1}</span>
                    <span className="w-7 h-7 rounded-full bg-surface-hover flex items-center justify-center text-xs">
                      {asset.icon}
                    </span>
                    <div>
                      <div className="text-sm font-medium">{asset.symbol}</div>
                      <div className="text-xs text-text-muted truncate max-w-[100px]">
                        {asset.name}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {formatCurrency(asset.price)}
                    </div>
                    <div
                      className={`text-xs font-medium ${getChangeColor(asset.change24h)}`}
                    >
                      {formatPercent(asset.change24h)}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
