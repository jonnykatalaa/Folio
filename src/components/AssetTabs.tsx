"use client";

import { AssetClass } from "@/lib/types";
import { TABS } from "@/lib/data";
import {
  LayoutGrid,
  Bitcoin,
  TrendingUp,
  Gem,
  Banknote,
} from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ElementType> = {
  LayoutGrid,
  Bitcoin,
  TrendingUp,
  Gem,
  Banknote,
};

interface AssetTabsProps {
  activeTab: AssetClass | "all";
  onTabChange: (tab: AssetClass | "all") => void;
}

export default function AssetTabs({ activeTab, onTabChange }: AssetTabsProps) {
  return (
    <div className="flex items-center gap-1 bg-surface border border-border rounded-xl p-1 overflow-x-auto">
      {TABS.map((tab) => {
        const Icon = iconMap[tab.icon] || LayoutGrid;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap",
              isActive
                ? "bg-accent text-white shadow-sm"
                : "text-text-secondary hover:text-text-primary hover:bg-surface-hover"
            )}
          >
            <Icon size={16} />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
