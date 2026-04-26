export type AssetClass = 'crypto' | 'stock' | 'etf'

export type SparkPoint = {
  day: string
  price: number
}

export type Asset = {
  id: string
  rank: number
  symbol: string
  name: string
  assetClass: AssetClass
  exchange: string
  coingeckoId?: string
  stooqSymbol?: string
  quoteSymbol?: string
  sector: string
  price: number
  change1h: number
  change24h: number
  change7d: number
  marketCap: number
  volume24h: number
  circulatingSupply?: number
  peRatio?: number
  dividendYield?: number
  sparkline: number[]
  sentiment: number
  riskScore: number
  description: string
  dataSource?: string
  isLive?: boolean
  liveSource?: string
  lastUpdated?: string
}

export type MarketDataStatus = {
  source: 'live' | 'fallback'
  updatedAt: string
  liveSymbols: string[]
  error?: string
}

export type PortfolioHolding = {
  symbol: string
  quantity: number
  averageCost: number
}

export type MarketSnapshot = {
  totalMarketCap: number
  totalVolume: number
  gainers: number
  losers: number
  volatilityIndex: number
}

export type Sector = {
  name: string
  marketCap: number
  change: number
}

export type SectorSummary = {
  name: string
  marketCap: number
  change24h: number
  assetCount: number
}

export type NewsItem = {
  source: string
  title: string
  summary: string
  impact: string
}

export type SentimentPoint = {
  time: string
  sentiment: number
}

export type SortKey =
  | 'rank'
  | 'price'
  | 'change24h'
  | 'change7d'
  | 'marketCap'
  | 'volume24h'
  | 'riskScore'
