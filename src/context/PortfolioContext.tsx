"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { Holding, Portfolio } from "@/lib/types";
import { DEFAULT_HOLDINGS, ASSETS } from "@/lib/data";

interface PortfolioContextType {
  portfolio: Portfolio;
  watchlist: string[];
  addHolding: (holding: Holding) => void;
  removeHolding: (assetId: string) => void;
  updateHolding: (assetId: string, quantity: number, avgBuyPrice: number) => void;
  toggleWatchlist: (assetId: string) => void;
  isInWatchlist: (assetId: string) => boolean;
  getHolding: (assetId: string) => Holding | undefined;
  getTotalValue: () => number;
  getTotalCost: () => number;
  getTotalPnL: () => number;
  getTotalPnLPercent: () => number;
  getAllocationByClass: () => { name: string; value: number; color: string }[];
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

const STORAGE_KEY_PORTFOLIO = "portfolio_holdings";
const STORAGE_KEY_WATCHLIST = "portfolio_watchlist";

export function PortfolioProvider({ children }: { children: React.ReactNode }) {
  const [portfolio, setPortfolio] = useState<Portfolio>({ holdings: DEFAULT_HOLDINGS });
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const savedPortfolio = localStorage.getItem(STORAGE_KEY_PORTFOLIO);
      const savedWatchlist = localStorage.getItem(STORAGE_KEY_WATCHLIST);
      if (savedPortfolio) setPortfolio(JSON.parse(savedPortfolio));
      if (savedWatchlist) setWatchlist(JSON.parse(savedWatchlist));
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY_PORTFOLIO, JSON.stringify(portfolio));
  }, [portfolio, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY_WATCHLIST, JSON.stringify(watchlist));
  }, [watchlist, hydrated]);

  const addHolding = useCallback((holding: Holding) => {
    setPortfolio((prev) => {
      const existing = prev.holdings.find((h) => h.assetId === holding.assetId);
      if (existing) {
        const totalQty = existing.quantity + holding.quantity;
        const totalCost =
          existing.quantity * existing.avgBuyPrice +
          holding.quantity * holding.avgBuyPrice;
        return {
          holdings: prev.holdings.map((h) =>
            h.assetId === holding.assetId
              ? { ...h, quantity: totalQty, avgBuyPrice: totalCost / totalQty }
              : h
          ),
        };
      }
      return { holdings: [...prev.holdings, holding] };
    });
  }, []);

  const removeHolding = useCallback((assetId: string) => {
    setPortfolio((prev) => ({
      holdings: prev.holdings.filter((h) => h.assetId !== assetId),
    }));
  }, []);

  const updateHolding = useCallback(
    (assetId: string, quantity: number, avgBuyPrice: number) => {
      setPortfolio((prev) => ({
        holdings: prev.holdings.map((h) =>
          h.assetId === assetId ? { ...h, quantity, avgBuyPrice } : h
        ),
      }));
    },
    []
  );

  const toggleWatchlist = useCallback((assetId: string) => {
    setWatchlist((prev) =>
      prev.includes(assetId) ? prev.filter((id) => id !== assetId) : [...prev, assetId]
    );
  }, []);

  const isInWatchlist = useCallback(
    (assetId: string) => watchlist.includes(assetId),
    [watchlist]
  );

  const getHolding = useCallback(
    (assetId: string) => portfolio.holdings.find((h) => h.assetId === assetId),
    [portfolio]
  );

  const getTotalValue = useCallback(() => {
    return portfolio.holdings.reduce((sum, h) => {
      const asset = ASSETS.find((a) => a.id === h.assetId);
      return sum + (asset ? asset.price * h.quantity : 0);
    }, 0);
  }, [portfolio]);

  const getTotalCost = useCallback(() => {
    return portfolio.holdings.reduce(
      (sum, h) => sum + h.avgBuyPrice * h.quantity,
      0
    );
  }, [portfolio]);

  const getTotalPnL = useCallback(() => {
    return getTotalValue() - getTotalCost();
  }, [getTotalValue, getTotalCost]);

  const getTotalPnLPercent = useCallback(() => {
    const cost = getTotalCost();
    if (cost === 0) return 0;
    return ((getTotalValue() - cost) / cost) * 100;
  }, [getTotalValue, getTotalCost]);

  const getAllocationByClass = useCallback(() => {
    const classMap: Record<string, number> = {};
    const colorMap: Record<string, string> = {
      crypto: "#f59e0b",
      stocks: "#3b82f6",
      commodities: "#a855f7",
      cash: "#22c55e",
    };

    portfolio.holdings.forEach((h) => {
      const asset = ASSETS.find((a) => a.id === h.assetId);
      if (asset) {
        const value = asset.price * h.quantity;
        classMap[asset.class] = (classMap[asset.class] || 0) + value;
      }
    });

    return Object.entries(classMap).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
      color: colorMap[name] || "#8b949e",
    }));
  }, [portfolio]);

  return (
    <PortfolioContext.Provider
      value={{
        portfolio,
        watchlist,
        addHolding,
        removeHolding,
        updateHolding,
        toggleWatchlist,
        isInWatchlist,
        getHolding,
        getTotalValue,
        getTotalCost,
        getTotalPnL,
        getTotalPnLPercent,
        getAllocationByClass,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (!context) throw new Error("usePortfolio must be used within PortfolioProvider");
  return context;
}
