"use client";

import { useParams, notFound } from "next/navigation";
import { ASSETS } from "@/lib/data";
import { usePortfolio } from "@/context/PortfolioContext";
import {
  formatCurrency,
  formatPercent,
  formatNumber,
  getChangeColor,
  getAssetClassColor,
  getAssetClassLabel,
  getChangeBg,
} from "@/lib/utils";
import {
  ArrowLeft,
  Star,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Activity,
  Coins,
  Globe,
} from "lucide-react";
import Link from "next/link";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useState, useMemo } from "react";
import PercentBadge from "@/components/PercentBadge";

function generateDetailChartData(basePrice: number, days: number) {
  const data = [];
  let price = basePrice * 0.85;
  for (let i = 0; i < days; i++) {
    const change = (Math.random() - 0.45) * basePrice * 0.02;
    price = Math.max(price + change, basePrice * 0.5);
    data.push({
      date: new Date(Date.now() - (days - i) * 86400000).toLocaleDateString(
        "en-US",
        { month: "short", day: "numeric" }
      ),
      price: Math.round(price * 100) / 100,
    });
  }
  return data;
}

type TimeRange = "7d" | "30d" | "90d" | "1y";

export default function AssetDetailPage() {
  const params = useParams();
  const asset = ASSETS.find((a) => a.id === params.id);
  const { isInWatchlist, toggleWatchlist, getHolding } = usePortfolio();
  const [timeRange, setTimeRange] = useState<TimeRange>("30d");

  const chartData = useMemo(() => {
    if (!asset) return [];
    const daysMap: Record<TimeRange, number> = {
      "7d": 7,
      "30d": 30,
      "90d": 90,
      "1y": 365,
    };
    return generateDetailChartData(asset.price, daysMap[timeRange]);
  }, [asset, timeRange]);

  if (!asset) {
    notFound();
  }

  const holding = getHolding(asset.id);
  const holdingValue = holding ? holding.quantity * asset.price : 0;
  const holdingCost = holding ? holding.quantity * holding.avgBuyPrice : 0;
  const holdingPnl = holdingValue - holdingCost;
  const holdingPnlPct = holdingCost > 0 ? (holdingPnl / holdingCost) * 100 : 0;

  const trend = asset.change24h >= 0;
  const chartColor = trend ? "#22c55e" : "#ef4444";

  const stats = [
    {
      label: "Market Cap",
      value: asset.marketCap > 0 ? formatCurrency(asset.marketCap, true) : "N/A",
      icon: Globe,
    },
    {
      label: "24h Volume",
      value: formatCurrency(asset.volume24h, true),
      icon: Activity,
    },
    {
      label: "Circulating Supply",
      value: asset.supply ? formatNumber(asset.supply, true) : "N/A",
      icon: Coins,
    },
    {
      label: "Max Supply",
      value: asset.maxSupply ? formatNumber(asset.maxSupply, true) : "Unlimited",
      icon: BarChart3,
    },
  ];

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 space-y-6">
      <Link
        href="/markets"
        className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Markets
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="w-12 h-12 rounded-full bg-surface border border-border flex items-center justify-center text-xl">
            {asset.icon}
          </span>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">{asset.name}</h1>
              <span className="text-sm text-text-muted bg-surface-hover px-2 py-0.5 rounded-md">
                {asset.symbol}
              </span>
              <span
                className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{
                  backgroundColor: getAssetClassColor(asset.class) + "20",
                  color: getAssetClassColor(asset.class),
                }}
              >
                {getAssetClassLabel(asset.class)}
              </span>
            </div>
            <div className="text-sm text-text-muted mt-0.5">
              Rank #{asset.rank} in {getAssetClassLabel(asset.class)}
            </div>
          </div>
        </div>
        <button
          onClick={() => toggleWatchlist(asset.id)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors text-sm font-medium ${
            isInWatchlist(asset.id)
              ? "border-yellow bg-yellow/10 text-yellow"
              : "border-border hover:border-border/80 text-text-secondary hover:text-text-primary"
          }`}
        >
          <Star
            size={16}
            className={isInWatchlist(asset.id) ? "fill-yellow" : ""}
          />
          {isInWatchlist(asset.id) ? "Watching" : "Add to Watchlist"}
        </button>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-end gap-3">
        <div className="text-4xl font-bold">{formatCurrency(asset.price)}</div>
        <div className="flex items-center gap-3 pb-1">
          <PercentBadge value={asset.change24h} size="md" />
          <span className="text-sm text-text-muted">24h</span>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Price Chart</h3>
          <div className="flex items-center gap-1 bg-background rounded-lg p-0.5">
            {(["7d", "30d", "90d", "1y"] as TimeRange[]).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                  timeRange === range
                    ? "bg-surface-hover text-text-primary"
                    : "text-text-muted hover:text-text-secondary"
                }`}
              >
                {range.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
        <div className="h-72 sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartColor} stopOpacity={0.15} />
                  <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#21262d"
                vertical={false}
              />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6e7681", fontSize: 11 }}
                interval="preserveStartEnd"
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6e7681", fontSize: 11 }}
                domain={["auto", "auto"]}
                tickFormatter={(v) => formatCurrency(v, true)}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#161b22",
                  border: "1px solid #21262d",
                  borderRadius: "8px",
                  color: "#e6edf3",
                  fontSize: "12px",
                }}
                formatter={(value: number) => [formatCurrency(value), "Price"]}
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke={chartColor}
                strokeWidth={2}
                fill="url(#colorPrice)"
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-surface border border-border rounded-xl p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <stat.icon size={14} className="text-text-muted" />
              <span className="text-xs text-text-muted font-medium uppercase tracking-wider">
                {stat.label}
              </span>
            </div>
            <div className="text-sm font-bold">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-surface border border-border rounded-xl p-4">
          <span className="text-xs text-text-muted font-medium uppercase tracking-wider">
            24h Change
          </span>
          <div className="mt-2 flex items-center gap-2">
            {asset.change24h >= 0 ? (
              <TrendingUp size={18} className="text-green" />
            ) : (
              <TrendingDown size={18} className="text-red" />
            )}
            <span
              className={`text-lg font-bold ${getChangeColor(asset.change24h)}`}
            >
              {formatPercent(asset.change24h)}
            </span>
          </div>
        </div>
        <div className="bg-surface border border-border rounded-xl p-4">
          <span className="text-xs text-text-muted font-medium uppercase tracking-wider">
            7d Change
          </span>
          <div className="mt-2 flex items-center gap-2">
            {asset.change7d >= 0 ? (
              <TrendingUp size={18} className="text-green" />
            ) : (
              <TrendingDown size={18} className="text-red" />
            )}
            <span
              className={`text-lg font-bold ${getChangeColor(asset.change7d)}`}
            >
              {formatPercent(asset.change7d)}
            </span>
          </div>
        </div>
        <div className="bg-surface border border-border rounded-xl p-4">
          <span className="text-xs text-text-muted font-medium uppercase tracking-wider">
            30d Change
          </span>
          <div className="mt-2 flex items-center gap-2">
            {asset.change30d >= 0 ? (
              <TrendingUp size={18} className="text-green" />
            ) : (
              <TrendingDown size={18} className="text-red" />
            )}
            <span
              className={`text-lg font-bold ${getChangeColor(asset.change30d)}`}
            >
              {formatPercent(asset.change30d)}
            </span>
          </div>
        </div>
      </div>

      {holding && (
        <div className="bg-surface border border-border rounded-xl p-6">
          <h3 className="font-semibold mb-4">Your Holdings</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-xs text-text-muted mb-1">Quantity</div>
              <div className="text-lg font-bold">
                {formatNumber(holding.quantity)}
              </div>
            </div>
            <div>
              <div className="text-xs text-text-muted mb-1">Current Value</div>
              <div className="text-lg font-bold">
                {formatCurrency(holdingValue, true)}
              </div>
            </div>
            <div>
              <div className="text-xs text-text-muted mb-1">Avg. Buy Price</div>
              <div className="text-lg font-bold">
                {formatCurrency(holding.avgBuyPrice)}
              </div>
            </div>
            <div>
              <div className="text-xs text-text-muted mb-1">P&L</div>
              <div
                className={`text-lg font-bold ${getChangeColor(holdingPnl)}`}
              >
                {formatCurrency(holdingPnl, true)}
              </div>
              <div className={`text-sm ${getChangeColor(holdingPnlPct)}`}>
                {formatPercent(holdingPnlPct)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
