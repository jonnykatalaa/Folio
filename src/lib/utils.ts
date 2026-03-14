export function formatCurrency(value: number, compact = false): string {
  if (compact) {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    if (value >= 1e3) return `$${(value / 1e3).toFixed(2)}K`;
  }
  if (value >= 1) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  }).format(value);
}

export function formatNumber(value: number, compact = false): string {
  if (compact) {
    if (value >= 1e12) return `${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
    if (value >= 1e3) return `${(value / 1e3).toFixed(2)}K`;
  }
  return new Intl.NumberFormat("en-US").format(value);
}

export function formatPercent(value: number): string {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function getChangeColor(value: number): string {
  if (value > 0) return "text-green";
  if (value < 0) return "text-red";
  return "text-text-secondary";
}

export function getChangeBg(value: number): string {
  if (value > 0) return "bg-green/10 text-green";
  if (value < 0) return "bg-red/10 text-red";
  return "bg-surface text-text-secondary";
}

export function getAssetClassColor(assetClass: string): string {
  switch (assetClass) {
    case "crypto":
      return "#f59e0b";
    case "stocks":
      return "#3b82f6";
    case "commodities":
      return "#a855f7";
    case "cash":
      return "#22c55e";
    default:
      return "#8b949e";
  }
}

export function getAssetClassLabel(assetClass: string): string {
  switch (assetClass) {
    case "crypto":
      return "Crypto";
    case "stocks":
      return "Stocks";
    case "commodities":
      return "Commodities";
    case "cash":
      return "Cash";
    default:
      return assetClass;
  }
}
