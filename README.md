# Folio Market Terminal

Folio is a polished market intelligence dashboard for crypto and stocks. It uses free, no-key market data APIs with local sample data as a fallback so it works immediately while still modeling the core workflows expected from a CoinMarketCap-style product.

## Features

- Unified crypto, ETF, and equity rankings with search, category filters, and sortable market metrics.
- Live no-key quotes from CoinGecko for crypto and Stooq delayed quotes for stocks/ETFs, refreshed every 60 seconds.
- Market pulse cards for total capitalization, 24h volume, average sentiment, and leader counts.
- Asset detail view with price, change, valuation, volume, supply, fundamentals, and a 30-day sparkline.
- Persistent watchlist stored in the browser.
- Portfolio sandbox that tracks selected positions, allocation, daily P/L, and total value.
- Responsive, dark, data-dense interface for desktop and mobile.

## Getting started

```bash
npm install
npm run dev
```

Open the URL printed by Vite.

## Quality checks

```bash
npm run lint
npm run build
```

## Live data

- Crypto: CoinGecko simple price API.
- Stocks and ETFs: Stooq quote CSV API through the Vite dev proxy at `/api/stooq`.
- Fallback: curated local data in `src/data/assets.ts` stays in place if a free endpoint is unavailable, rate-limited, or offline.
