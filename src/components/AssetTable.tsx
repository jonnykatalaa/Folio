"use client";

import { useState, useMemo } from "react";
import { Asset, AssetClass, SortField, SortDirection } from "@/lib/types";
import { ASSETS } from "@/lib/data";
import { formatCurrency, formatNumber, cn, getChangeColor, formatPercent } from "@/lib/utils";
import MiniSparkline from "./MiniSparkline";
import { Star, ChevronUp, ChevronDown } from "lucide-react";
import { usePortfolio } from "@/context/PortfolioContext";
import Link from "next/link";

interface AssetTableProps {
  assetClass?: AssetClass | "all";
  limit?: number;
  showWatchlistOnly?: boolean;
}

export default function AssetTable({
  assetClass = "all",
  limit,
  showWatchlistOnly = false,
}: AssetTableProps) {
  const { isInWatchlist, toggleWatchlist } = usePortfolio();
  const [sortField, setSortField] = useState<SortField>("rank");
  const [sortDir, setSortDir] = useState<SortDirection>("asc");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir(field === "rank" ? "asc" : "desc");
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <span className="w-3" />;
    return sortDir === "asc" ? (
      <ChevronUp size={12} />
    ) : (
      <ChevronDown size={12} />
    );
  };

  const assets = useMemo(() => {
    let filtered: Asset[] =
      assetClass === "all"
        ? [...ASSETS]
        : ASSETS.filter((a) => a.class === assetClass);

    if (showWatchlistOnly) {
      filtered = filtered.filter((a) => isInWatchlist(a.id));
    }

    filtered.sort((a, b) => {
      let aVal: number, bVal: number;
      switch (sortField) {
        case "rank":
          aVal = a.rank;
          bVal = b.rank;
          break;
        case "name":
          return sortDir === "asc"
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);
        case "price":
          aVal = a.price;
          bVal = b.price;
          break;
        case "change24h":
          aVal = a.change24h;
          bVal = b.change24h;
          break;
        case "change7d":
          aVal = a.change7d;
          bVal = b.change7d;
          break;
        case "change30d":
          aVal = a.change30d;
          bVal = b.change30d;
          break;
        case "marketCap":
          aVal = a.marketCap;
          bVal = b.marketCap;
          break;
        case "volume24h":
          aVal = a.volume24h;
          bVal = b.volume24h;
          break;
        default:
          aVal = a.rank;
          bVal = b.rank;
      }
      return sortDir === "asc" ? aVal - bVal : bVal - aVal;
    });

    if (limit) filtered = filtered.slice(0, limit);
    return filtered;
  }, [assetClass, sortField, sortDir, limit, showWatchlistOnly, isInWatchlist]);

  const thClass =
    "px-4 py-3 text-xs font-medium text-text-muted uppercase tracking-wider cursor-pointer hover:text-text-secondary transition-colors select-none";

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="px-2 py-3 w-10"></th>
            <th
              className={cn(thClass, "text-left w-12")}
              onClick={() => handleSort("rank")}
            >
              <span className="flex items-center gap-1">
                # <SortIcon field="rank" />
              </span>
            </th>
            <th
              className={cn(thClass, "text-left")}
              onClick={() => handleSort("name")}
            >
              <span className="flex items-center gap-1">
                Name <SortIcon field="name" />
              </span>
            </th>
            <th
              className={cn(thClass, "text-right")}
              onClick={() => handleSort("price")}
            >
              <span className="flex items-center gap-1 justify-end">
                Price <SortIcon field="price" />
              </span>
            </th>
            <th
              className={cn(thClass, "text-right")}
              onClick={() => handleSort("change24h")}
            >
              <span className="flex items-center gap-1 justify-end">
                24h % <SortIcon field="change24h" />
              </span>
            </th>
            <th
              className={cn(thClass, "text-right hidden md:table-cell")}
              onClick={() => handleSort("change7d")}
            >
              <span className="flex items-center gap-1 justify-end">
                7d % <SortIcon field="change7d" />
              </span>
            </th>
            <th
              className={cn(thClass, "text-right hidden lg:table-cell")}
              onClick={() => handleSort("change30d")}
            >
              <span className="flex items-center gap-1 justify-end">
                30d % <SortIcon field="change30d" />
              </span>
            </th>
            <th
              className={cn(thClass, "text-right hidden sm:table-cell")}
              onClick={() => handleSort("marketCap")}
            >
              <span className="flex items-center gap-1 justify-end">
                Market Cap <SortIcon field="marketCap" />
              </span>
            </th>
            <th
              className={cn(thClass, "text-right hidden lg:table-cell")}
              onClick={() => handleSort("volume24h")}
            >
              <span className="flex items-center gap-1 justify-end">
                Volume(24h) <SortIcon field="volume24h" />
              </span>
            </th>
            <th className={cn(thClass, "text-center hidden xl:table-cell")}>
              Last 7 Days
            </th>
          </tr>
        </thead>
        <tbody>
          {assets.map((asset, i) => (
            <tr
              key={asset.id}
              className="border-b border-border/50 hover:bg-surface-hover transition-colors animate-fade-in"
              style={{ animationDelay: `${i * 20}ms` }}
            >
              <td className="px-2 py-4">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    toggleWatchlist(asset.id);
                  }}
                  className="text-text-muted hover:text-yellow transition-colors"
                >
                  <Star
                    size={16}
                    className={
                      isInWatchlist(asset.id) ? "fill-yellow text-yellow" : ""
                    }
                  />
                </button>
              </td>
              <td className="px-4 py-4 text-sm text-text-muted">{asset.rank}</td>
              <td className="px-4 py-4">
                <Link
                  href={`/asset/${asset.id}`}
                  className="flex items-center gap-3 group"
                >
                  <span className="w-8 h-8 rounded-full bg-surface-hover flex items-center justify-center text-sm flex-shrink-0">
                    {asset.icon}
                  </span>
                  <div className="min-w-0">
                    <div className="font-medium text-sm group-hover:text-accent transition-colors truncate">
                      {asset.name}
                    </div>
                    <div className="text-xs text-text-muted">{asset.symbol}</div>
                  </div>
                </Link>
              </td>
              <td className="px-4 py-4 text-right text-sm font-medium">
                {formatCurrency(asset.price)}
              </td>
              <td
                className={`px-4 py-4 text-right text-sm font-medium ${getChangeColor(asset.change24h)}`}
              >
                {formatPercent(asset.change24h)}
              </td>
              <td
                className={`px-4 py-4 text-right text-sm font-medium hidden md:table-cell ${getChangeColor(asset.change7d)}`}
              >
                {formatPercent(asset.change7d)}
              </td>
              <td
                className={`px-4 py-4 text-right text-sm font-medium hidden lg:table-cell ${getChangeColor(asset.change30d)}`}
              >
                {formatPercent(asset.change30d)}
              </td>
              <td className="px-4 py-4 text-right text-sm text-text-secondary hidden sm:table-cell">
                {asset.marketCap > 0 ? formatCurrency(asset.marketCap, true) : "N/A"}
              </td>
              <td className="px-4 py-4 text-right text-sm text-text-secondary hidden lg:table-cell">
                {formatCurrency(asset.volume24h, true)}
              </td>
              <td className="px-4 py-4 hidden xl:table-cell">
                <div className="flex justify-center">
                  <MiniSparkline data={asset.sparkline} />
                </div>
              </td>
            </tr>
          ))}
          {assets.length === 0 && (
            <tr>
              <td colSpan={10} className="px-4 py-12 text-center text-text-muted">
                No assets found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
