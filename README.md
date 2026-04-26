# Folio Market Terminal

Folio is a polished market intelligence dashboard for crypto and stocks. It is built as a self-contained React app with local sample data so it works immediately without API keys, while still modeling the core workflows expected from a CoinMarketCap-style product.

## Features

- Unified crypto and equity rankings with search, category filters, and sortable market metrics.
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

## Notes

The current app uses curated local market data in `src/data/assets.ts` so reviewers can run and test the product without provisioning third-party market data credentials. A production version can replace that module with provider-backed ingestion while keeping the UI contracts in `src/types.ts`.
