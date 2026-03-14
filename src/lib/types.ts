export type AssetClass = "crypto" | "stocks" | "commodities" | "cash";

export interface Asset {
  id: string;
  symbol: string;
  name: string;
  class: AssetClass;
  price: number;
  change24h: number;
  change7d: number;
  change30d: number;
  marketCap: number;
  volume24h: number;
  supply?: number;
  maxSupply?: number;
  icon: string;
  sparkline: number[];
  rank: number;
}

export interface Holding {
  assetId: string;
  quantity: number;
  avgBuyPrice: number;
}

export interface Portfolio {
  holdings: Holding[];
}

export interface WatchlistItem {
  assetId: string;
}

export type SortField =
  | "rank"
  | "name"
  | "price"
  | "change24h"
  | "change7d"
  | "change30d"
  | "marketCap"
  | "volume24h";

export type SortDirection = "asc" | "desc";

export interface TabConfig {
  id: AssetClass | "all";
  label: string;
  icon: string;
}
