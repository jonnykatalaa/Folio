"use client";

import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { formatPercent, getChangeBg } from "@/lib/utils";

interface PercentBadgeProps {
  value: number;
  showIcon?: boolean;
  size?: "sm" | "md";
}

export default function PercentBadge({
  value,
  showIcon = true,
  size = "sm",
}: PercentBadgeProps) {
  const Icon = value > 0 ? TrendingUp : value < 0 ? TrendingDown : Minus;
  const iconSize = size === "sm" ? 12 : 14;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md font-medium ${getChangeBg(value)} ${
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-sm"
      }`}
    >
      {showIcon && <Icon size={iconSize} />}
      {formatPercent(value)}
    </span>
  );
}
