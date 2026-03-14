"use client";

import { usePortfolio } from "@/context/PortfolioContext";
import { formatCurrency, formatPercent, getChangeColor } from "@/lib/utils";
import { TrendingUp, TrendingDown, Wallet, PieChart, BarChart3, DollarSign } from "lucide-react";
import {
  PieChart as RPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { ASSETS } from "@/lib/data";

export default function PortfolioOverview() {
  const {
    getTotalValue,
    getTotalCost,
    getTotalPnL,
    getTotalPnLPercent,
    getAllocationByClass,
    portfolio,
  } = usePortfolio();

  const totalValue = getTotalValue();
  const totalCost = getTotalCost();
  const pnl = getTotalPnL();
  const pnlPercent = getTotalPnLPercent();
  const allocation = getAllocationByClass();
  const holdingsCount = portfolio.holdings.length;

  const topPerformers = portfolio.holdings
    .map((h) => {
      const asset = ASSETS.find((a) => a.id === h.assetId);
      if (!asset) return null;
      const value = asset.price * h.quantity;
      const cost = h.avgBuyPrice * h.quantity;
      const pnlPct = cost > 0 ? ((value - cost) / cost) * 100 : 0;
      return { asset, holding: h, value, pnlPct };
    })
    .filter(Boolean)
    .sort((a, b) => b!.pnlPct - a!.pnlPct)
    .slice(0, 5);

  const stats = [
    {
      label: "Total Value",
      value: formatCurrency(totalValue, true),
      icon: Wallet,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      label: "Total Cost",
      value: formatCurrency(totalCost, true),
      icon: DollarSign,
      color: "text-purple",
      bgColor: "bg-purple/10",
    },
    {
      label: "Total P&L",
      value: formatCurrency(pnl, true),
      subValue: formatPercent(pnlPercent),
      icon: pnl >= 0 ? TrendingUp : TrendingDown,
      color: pnl >= 0 ? "text-green" : "text-red",
      bgColor: pnl >= 0 ? "bg-green/10" : "bg-red/10",
    },
    {
      label: "Holdings",
      value: holdingsCount.toString(),
      icon: BarChart3,
      color: "text-cyan",
      bgColor: "bg-cyan/10",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-surface border border-border rounded-xl p-4 hover:border-border/80 transition-colors"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                <stat.icon size={20} className={stat.color} />
              </div>
              <span className="text-xs text-text-muted font-medium uppercase tracking-wider">
                {stat.label}
              </span>
            </div>
            <div className="text-xl font-bold">{stat.value}</div>
            {stat.subValue && (
              <div className={`text-sm font-medium mt-1 ${stat.color}`}>
                {stat.subValue}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface border border-border rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <PieChart size={18} className="text-text-muted" />
            <h3 className="font-semibold">Asset Allocation</h3>
          </div>
          <div className="flex items-center gap-6">
            <div className="w-48 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <RPieChart>
                  <Pie
                    data={allocation}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {allocation.map((entry, idx) => (
                      <Cell key={idx} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#161b22",
                      border: "1px solid #21262d",
                      borderRadius: "8px",
                      color: "#e6edf3",
                      fontSize: "12px",
                    }}
                    formatter={(value: number) => formatCurrency(value, true)}
                  />
                </RPieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-3">
              {allocation.map((item) => {
                const pct = totalValue > 0 ? (item.value / totalValue) * 100 : 0;
                return (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm">{item.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        {formatCurrency(item.value, true)}
                      </div>
                      <div className="text-xs text-text-muted">
                        {pct.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="bg-surface border border-border rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={18} className="text-text-muted" />
            <h3 className="font-semibold">Top Performers</h3>
          </div>
          <div className="space-y-3">
            {topPerformers.map((item) => {
              if (!item) return null;
              return (
                <div
                  key={item.asset.id}
                  className="flex items-center justify-between py-2 border-b border-border/50 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-surface-hover flex items-center justify-center text-sm">
                      {item.asset.icon}
                    </span>
                    <div>
                      <div className="text-sm font-medium">{item.asset.symbol}</div>
                      <div className="text-xs text-text-muted">{item.asset.name}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {formatCurrency(item.value, true)}
                    </div>
                    <div
                      className={`text-xs font-medium ${getChangeColor(item.pnlPct)}`}
                    >
                      {formatPercent(item.pnlPct)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
