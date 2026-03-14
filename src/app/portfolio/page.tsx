"use client";

import { useState } from "react";
import PortfolioOverview from "@/components/PortfolioOverview";
import HoldingsTable from "@/components/HoldingsTable";
import AssetTable from "@/components/AssetTable";
import AddHoldingModal from "@/components/AddHoldingModal";
import { Plus, Star, List } from "lucide-react";
import { cn } from "@/lib/utils";

type Tab = "holdings" | "watchlist";

export default function PortfolioPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("holdings");

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1">Portfolio</h1>
          <p className="text-text-secondary text-sm">
            Manage your holdings and track performance
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-accent hover:bg-accent-hover text-white text-sm font-medium transition-colors"
        >
          <Plus size={16} />
          Add Asset
        </button>
      </div>

      <PortfolioOverview />

      <div className="flex items-center gap-1 bg-surface border border-border rounded-xl p-1">
        <button
          onClick={() => setActiveTab("holdings")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
            activeTab === "holdings"
              ? "bg-accent text-white shadow-sm"
              : "text-text-secondary hover:text-text-primary hover:bg-surface-hover"
          )}
        >
          <List size={16} />
          Holdings
        </button>
        <button
          onClick={() => setActiveTab("watchlist")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
            activeTab === "watchlist"
              ? "bg-accent text-white shadow-sm"
              : "text-text-secondary hover:text-text-primary hover:bg-surface-hover"
          )}
        >
          <Star size={16} />
          Watchlist
        </button>
      </div>

      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        {activeTab === "holdings" ? (
          <HoldingsTable />
        ) : (
          <AssetTable showWatchlistOnly />
        )}
      </div>

      <AddHoldingModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} />
    </div>
  );
}
