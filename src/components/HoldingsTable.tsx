"use client";

import { usePortfolio } from "@/context/PortfolioContext";
import { ASSETS } from "@/lib/data";
import {
  formatCurrency,
  formatPercent,
  formatNumber,
  getChangeColor,
  getAssetClassColor,
} from "@/lib/utils";
import { Trash2 } from "lucide-react";
import Link from "next/link";

export default function HoldingsTable() {
  const { portfolio, removeHolding, getTotalValue } = usePortfolio();
  const totalValue = getTotalValue();

  const holdings = portfolio.holdings
    .map((h) => {
      const asset = ASSETS.find((a) => a.id === h.assetId);
      if (!asset) return null;
      const currentValue = asset.price * h.quantity;
      const cost = h.avgBuyPrice * h.quantity;
      const pnl = currentValue - cost;
      const pnlPercent = cost > 0 ? (pnl / cost) * 100 : 0;
      const allocation = totalValue > 0 ? (currentValue / totalValue) * 100 : 0;
      return { ...h, asset, currentValue, cost, pnl, pnlPercent, allocation };
    })
    .filter(Boolean)
    .sort((a, b) => b!.currentValue - a!.currentValue);

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
              Asset
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-text-muted uppercase tracking-wider">
              Price
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-text-muted uppercase tracking-wider hidden sm:table-cell">
              Qty
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-text-muted uppercase tracking-wider">
              Value
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-text-muted uppercase tracking-wider hidden md:table-cell">
              Avg Cost
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-text-muted uppercase tracking-wider hidden sm:table-cell">
              P&L
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-text-muted uppercase tracking-wider hidden lg:table-cell">
              Allocation
            </th>
            <th className="px-4 py-3 w-12"></th>
          </tr>
        </thead>
        <tbody>
          {holdings.map((item, i) => {
            if (!item) return null;
            return (
              <tr
                key={item.assetId}
                className="border-b border-border/50 hover:bg-surface-hover transition-colors animate-fade-in"
                style={{ animationDelay: `${i * 20}ms` }}
              >
                <td className="px-4 py-4">
                  <Link
                    href={`/asset/${item.asset.id}`}
                    className="flex items-center gap-3 group"
                  >
                    <span className="w-8 h-8 rounded-full bg-surface-hover flex items-center justify-center text-sm flex-shrink-0">
                      {item.asset.icon}
                    </span>
                    <div className="min-w-0">
                      <div className="font-medium text-sm group-hover:text-accent transition-colors">
                        {item.asset.name}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-text-muted">{item.asset.symbol}</span>
                        <span
                          className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
                          style={{
                            backgroundColor: getAssetClassColor(item.asset.class) + "20",
                            color: getAssetClassColor(item.asset.class),
                          }}
                        >
                          {item.asset.class}
                        </span>
                      </div>
                    </div>
                  </Link>
                </td>
                <td className="px-4 py-4 text-right">
                  <div className="text-sm font-medium">
                    {formatCurrency(item.asset.price)}
                  </div>
                  <div
                    className={`text-xs ${getChangeColor(item.asset.change24h)}`}
                  >
                    {formatPercent(item.asset.change24h)}
                  </div>
                </td>
                <td className="px-4 py-4 text-right text-sm text-text-secondary hidden sm:table-cell">
                  {formatNumber(item.quantity)}
                </td>
                <td className="px-4 py-4 text-right text-sm font-medium">
                  {formatCurrency(item.currentValue, true)}
                </td>
                <td className="px-4 py-4 text-right text-sm text-text-secondary hidden md:table-cell">
                  {formatCurrency(item.avgBuyPrice)}
                </td>
                <td className="px-4 py-4 text-right hidden sm:table-cell">
                  <div
                    className={`text-sm font-medium ${getChangeColor(item.pnl)}`}
                  >
                    {formatCurrency(item.pnl, true)}
                  </div>
                  <div className={`text-xs ${getChangeColor(item.pnlPercent)}`}>
                    {formatPercent(item.pnlPercent)}
                  </div>
                </td>
                <td className="px-4 py-4 text-right hidden lg:table-cell">
                  <div className="flex items-center justify-end gap-2">
                    <div className="w-16 h-1.5 bg-background rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-accent"
                        style={{ width: `${Math.min(item.allocation, 100)}%` }}
                      />
                    </div>
                    <span className="text-xs text-text-muted w-10 text-right">
                      {item.allocation.toFixed(1)}%
                    </span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <button
                    onClick={() => removeHolding(item.assetId)}
                    className="p-1.5 rounded-lg text-text-muted hover:text-red hover:bg-red/10 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            );
          })}
          {holdings.length === 0 && (
            <tr>
              <td colSpan={8} className="px-4 py-12 text-center text-text-muted">
                No holdings yet. Add your first asset to get started.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
