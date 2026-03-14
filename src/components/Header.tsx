"use client";

import { usePortfolio } from "@/context/PortfolioContext";
import { formatCurrency, formatPercent, getChangeColor } from "@/lib/utils";
import { Search } from "lucide-react";
import { useState, useMemo } from "react";
import { ASSETS } from "@/lib/data";
import Link from "next/link";

export default function Header() {
  const { getTotalValue, getTotalPnLPercent } = usePortfolio();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return ASSETS.filter(
      (a) =>
        a.name.toLowerCase().includes(q) || a.symbol.toLowerCase().includes(q)
    ).slice(0, 8);
  }, [searchQuery]);

  const totalValue = getTotalValue();
  const pnlPercent = getTotalPnLPercent();

  return (
    <header className="sticky top-0 z-50 bg-surface/80 backdrop-blur-xl border-b border-border">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-purple flex items-center justify-center font-bold text-sm">
                PT
              </div>
              <span className="font-bold text-lg hidden sm:block">PortfolioTracker</span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              <Link
                href="/"
                className="px-3 py-2 rounded-lg text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/markets"
                className="px-3 py-2 rounded-lg text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-colors"
              >
                Markets
              </Link>
              <Link
                href="/portfolio"
                className="px-3 py-2 rounded-lg text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-colors"
              >
                Portfolio
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="flex items-center bg-background border border-border rounded-lg px-3 py-2 gap-2 w-48 sm:w-64">
                <Search size={16} className="text-text-muted flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search assets..."
                  className="bg-transparent text-sm outline-none w-full text-text-primary placeholder-text-muted"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setSearchOpen(true);
                  }}
                  onFocus={() => setSearchOpen(true)}
                  onBlur={() => setTimeout(() => setSearchOpen(false), 200)}
                />
              </div>
              {searchOpen && searchResults.length > 0 && (
                <div className="absolute top-full mt-2 w-full bg-surface border border-border rounded-xl shadow-2xl overflow-hidden z-50">
                  {searchResults.map((asset) => (
                    <Link
                      key={asset.id}
                      href={`/asset/${asset.id}`}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-surface-hover transition-colors"
                      onClick={() => {
                        setSearchQuery("");
                        setSearchOpen(false);
                      }}
                    >
                      <span className="text-lg w-6 text-center">{asset.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium">{asset.name}</div>
                        <div className="text-xs text-text-muted">{asset.symbol}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          {formatCurrency(asset.price)}
                        </div>
                        <div className={`text-xs ${getChangeColor(asset.change24h)}`}>
                          {formatPercent(asset.change24h)}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div className="hidden sm:flex items-center gap-2 text-sm">
              <span className="text-text-muted">Portfolio:</span>
              <span className="font-semibold">{formatCurrency(totalValue, true)}</span>
              <span className={`text-xs font-medium ${getChangeColor(pnlPercent)}`}>
                {formatPercent(pnlPercent)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
