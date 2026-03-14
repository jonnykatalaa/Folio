"use client";

import { ASSETS } from "@/lib/data";
import { formatCurrency, formatPercent, getChangeColor } from "@/lib/utils";
import Link from "next/link";

export default function TickerBar() {
  const tickers = [...ASSETS].sort((a, b) => b.volume24h - a.volume24h).slice(0, 12);

  return (
    <div className="bg-background border-b border-border overflow-hidden">
      <div className="flex items-center gap-6 px-4 py-2 animate-marquee whitespace-nowrap">
        {[...tickers, ...tickers].map((asset, i) => (
          <Link
            key={`${asset.id}-${i}`}
            href={`/asset/${asset.id}`}
            className="inline-flex items-center gap-2 text-xs hover:opacity-80 transition-opacity flex-shrink-0"
          >
            <span className="text-text-muted">{asset.symbol}</span>
            <span className="font-medium">{formatCurrency(asset.price)}</span>
            <span className={`font-medium ${getChangeColor(asset.change24h)}`}>
              {formatPercent(asset.change24h)}
            </span>
          </Link>
        ))}
      </div>
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
