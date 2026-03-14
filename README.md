# PortfolioTracker

A unified portfolio tracker with a CoinMarketCap-style UI for managing and tracking assets across multiple classes:

- **Crypto** - Bitcoin, Ethereum, Solana, and more
- **Stocks** - Apple, Microsoft, NVIDIA, and top equities
- **Commodities** - Gold, Silver, Oil, and raw materials
- **Cash/Forex** - USD, EUR, GBP, and global currencies

## Features

- **Dashboard** with portfolio overview, allocation pie chart, and top performers
- **Markets** page with sortable, filterable tables for all asset classes
- **Portfolio** management with add/remove holdings and P&L tracking
- **Asset Detail** pages with interactive price charts
- **Watchlist** to track assets you're interested in
- **Live Ticker** bar with scrolling asset prices
- **Search** across all assets from the header
- **Responsive** design for mobile, tablet, and desktop

## Tech Stack

- [Next.js 15](https://nextjs.org/) with App Router
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Recharts](https://recharts.org/) for charts
- [Lucide React](https://lucide.dev/) for icons

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
  app/              # Next.js App Router pages
    asset/[id]/     # Asset detail page
    markets/        # Markets listing page
    portfolio/      # Portfolio management page
  components/       # Reusable UI components
  context/          # React Context for state management
  lib/              # Types, data, and utility functions
```
