import type { Asset, MarketDataStatus } from '../types'

type CoinGeckoQuote = {
  usd?: number
  usd_24h_change?: number
  usd_24h_vol?: number
  usd_market_cap?: number
}

type StooqQuote = {
  close: number
  open: number
  volume: number
  updatedAt: string
}

const cryptoIds: Record<string, string> = {
  BTC: 'bitcoin',
  ETH: 'ethereum',
  SOL: 'solana',
  XRP: 'ripple',
  LINK: 'chainlink',
}

const equitySymbols: Record<string, string> = {
  NVDA: 'nvda.us',
  AAPL: 'aapl.us',
  MSFT: 'msft.us',
  TSLA: 'tsla.us',
  AMZN: 'amzn.us',
  JPM: 'jpm.us',
  SPY: 'spy.us',
  META: 'meta.us',
}

const buildStatus = (
  assets: Asset[],
  source: MarketDataStatus['source'],
  error?: string,
): MarketDataStatus => ({
  source,
  updatedAt: new Date().toISOString(),
  liveSymbols: assets.filter((asset) => asset.isLive).map((asset) => asset.symbol),
  error,
})

const fetchJson = async <T>(path: string): Promise<T> => {
  const response = await fetch(path)

  if (!response.ok) {
    throw new Error(`Market API returned ${response.status}`)
  }

  return response.json() as Promise<T>
}

const fetchText = async (path: string): Promise<string> => {
  const response = await fetch(path)

  if (!response.ok) {
    throw new Error(`Market API returned ${response.status}`)
  }

  return response.text()
}

const parseStooqCsv = (csv: string): StooqQuote | null => {
  const [, row] = csv.trim().split(/\r?\n/)

  if (!row) {
    return null
  }

  const [, date, time, open, , , close, volume] = row.split(',')

  if (!date || date === 'N/D' || !close || close === 'N/D') {
    return null
  }

  return {
    close: Number(close),
    open: Number(open),
    volume: Number(volume),
    updatedAt: `${date} ${time}`,
  }
}

const applyCoinGeckoQuotes = async (assets: Asset[]) => {
  const idToSymbol = Object.entries(cryptoIds).reduce<Record<string, string>>((accumulator, [symbol, id]) => {
    accumulator[id] = symbol
    return accumulator
  }, {})
  const ids = Object.values(cryptoIds).join(',')
  const url = `/api/coingecko/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true`
  const quotes = await fetchJson<Record<string, CoinGeckoQuote>>(url)
  const quoteBySymbol = Object.entries(quotes).reduce<Record<string, CoinGeckoQuote>>(
    (accumulator, [id, quote]) => {
      const symbol = idToSymbol[id]

      if (symbol) {
        accumulator[symbol] = quote
      }

      return accumulator
    },
    {},
  )

  return assets.map((asset) => {
    const quote = quoteBySymbol[asset.symbol]

    if (!quote?.usd) {
      return asset
    }

    return {
      ...asset,
      price: quote.usd,
      change24h: quote.usd_24h_change ?? asset.change24h,
      change7d: quote.usd_24h_change ?? asset.change7d,
      marketCap: quote.usd_market_cap ?? asset.marketCap,
      volume24h: quote.usd_24h_vol ?? asset.volume24h,
      sparkline: [...asset.sparkline.slice(1), quote.usd],
      isLive: true,
      liveSource: 'CoinGecko',
      lastUpdated: new Date().toISOString(),
    }
  })
}

const applyStooqQuotes = async (assets: Asset[]) => {
  const quoteEntries = await Promise.all(
    Object.entries(equitySymbols).map(async ([symbol, stooqSymbol]) => {
      const url = `/api/stooq/q/l/?s=${stooqSymbol}&f=sd2t2ohlcv&h&e=csv`
      const quote = parseStooqCsv(await fetchText(url))
      return [symbol, quote] as const
    }),
  )
  const quotes = Object.fromEntries(quoteEntries)

  return assets.map((asset) => {
    const quote = quotes[asset.symbol]

    if (!quote) {
      return asset
    }

    const change24h = ((quote.close - quote.open) / quote.open) * 100

    return {
      ...asset,
      price: quote.close,
      change1h: change24h,
      change24h,
      change7d: change24h,
      volume24h: quote.volume * quote.close,
      sparkline: [...asset.sparkline.slice(1), quote.close],
      isLive: true,
      liveSource: 'Stooq delayed',
      lastUpdated: quote.updatedAt,
    }
  })
}

export const loadMarketData = async (fallbackAssets: Asset[]) => {
  let nextAssets: Asset[] = fallbackAssets.map((asset) => ({ ...asset, isLive: false }))
  const errors: string[] = []

  try {
    nextAssets = await applyCoinGeckoQuotes(nextAssets)
  } catch (error) {
    errors.push(error instanceof Error ? `CoinGecko: ${error.message}` : 'CoinGecko failed')
  }

  try {
    nextAssets = await applyStooqQuotes(nextAssets)
  } catch (error) {
    errors.push(error instanceof Error ? `Stooq: ${error.message}` : 'Stooq failed')
  }

  const source = nextAssets.some((asset) => asset.isLive) ? 'live' : 'fallback'

  return {
    assets: nextAssets,
    status: buildStatus(nextAssets, source, errors.length ? errors.join(' | ') : undefined),
  }
}
