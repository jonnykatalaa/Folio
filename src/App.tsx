import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Bell,
  Bitcoin,
  BriefcaseBusiness,
  Building2,
  ChevronDown,
  Clock3,
  Flame,
  Globe2,
  LineChart,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  TrendingUp,
  WalletCards,
} from 'lucide-react'
import type { ReactNode } from 'react'
import { useEffect, useMemo, useState } from 'react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart as RechartsLineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { assets, holdings, newsItems, sectorSummaries, sentimentSeries } from './data/assets'
import type { AssetClass, SortKey } from './types'
import './styles.css'

const formatCurrency = (value: number, compact = false) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: value > 1000 ? 0 : 2,
    notation: compact ? 'compact' : 'standard',
  }).format(value)

const formatPercent = (value: number) => `${value > 0 ? '+' : ''}${value.toFixed(2)}%`

const classLabels: Record<AssetClass | 'all', string> = {
  all: 'All',
  crypto: 'Crypto',
  stock: 'Stocks',
  etf: 'ETFs',
}

const sortOptions: Array<{ label: string; value: SortKey }> = [
  { label: 'Market cap', value: 'marketCap' },
  { label: '24h gainers', value: 'change24h' },
  { label: '7d momentum', value: 'change7d' },
  { label: 'Volume', value: 'volume24h' },
  { label: 'Risk score', value: 'riskScore' },
]

const sparkDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const heatColors = ['#5e5ce6', '#007aff', '#5ac8fa', '#30d158', '#ff9f0a', '#ff375f', '#af52de']
const sortAssets = (items: typeof assets, key: SortKey) => [...items].sort((a, b) => b[key] - a[key])

function App() {
  const [assetClass, setAssetClass] = useState<AssetClass | 'all'>('all')
  const [sortKey, setSortKey] = useState<SortKey>('marketCap')
  const [query, setQuery] = useState('')
  const [selectedSymbol, setSelectedSymbol] = useState('NVDA')
  const [watchlist, setWatchlist] = useState<string[]>(['BTC', 'NVDA', 'AAPL', 'ETH', 'SPY'])

  const visibleAssets = useMemo(() => {
    const normalized = query.trim().toLowerCase()

    return sortAssets(
      assets
        .filter((asset) => assetClass === 'all' || asset.assetClass === assetClass)
        .filter((asset) =>
          [asset.name, asset.symbol, asset.sector, asset.exchange].some((field) =>
            field.toLowerCase().includes(normalized),
          ),
        ),
      sortKey,
    )
  }, [assetClass, query, sortKey])

  useEffect(() => {
    if (visibleAssets.length && !visibleAssets.some((asset) => asset.symbol === selectedSymbol)) {
      setSelectedSymbol(visibleAssets[0].symbol)
    }
  }, [selectedSymbol, visibleAssets])

  const selectedAsset =
    visibleAssets.find((asset) => asset.symbol === selectedSymbol) ??
    visibleAssets[0] ??
    assets.find((asset) => asset.symbol === selectedSymbol) ??
    assets[0]

  const selectedSparkline = useMemo(
    () => selectedAsset.sparkline.map((price, index) => ({ day: sparkDays[index] ?? `${index + 1}`, price })),
    [selectedAsset],
  )

  const totals = useMemo(() => {
    const marketCap = assets.reduce((sum, asset) => sum + asset.marketCap, 0)
    const volume = assets.reduce((sum, asset) => sum + asset.volume24h, 0)
    const gainers = assets.filter((asset) => asset.change24h > 0).length
    const averageSentiment = Math.round(
      assets.reduce((sum, asset) => sum + asset.sentiment, 0) / assets.length,
    )

    return { marketCap, volume, gainers, averageSentiment }
  }, [])

  const portfolioRows = holdings.map((holding) => {
    const asset = assets.find((item) => item.symbol === holding.symbol)!
    const value = asset.price * holding.quantity
    const cost = holding.averageCost * holding.quantity
    const gain = value - cost

    return { ...holding, asset, value, gain, gainPercent: (gain / cost) * 100 }
  })

  const portfolioValue = portfolioRows.reduce((sum, holding) => sum + holding.value, 0)
  const portfolioGain = portfolioRows.reduce((sum, holding) => sum + holding.gain, 0)

  const toggleWatchlist = (symbol: string) => {
    setWatchlist((current) =>
      current.includes(symbol) ? current.filter((item) => item !== symbol) : [...current, symbol],
    )
  }

  const handleMarketChange = (value: AssetClass | 'all') => {
    setAssetClass(value)
    setQuery('')
    setSelectedSymbol(
      sortAssets(
        value === 'all' ? assets : assets.filter((asset) => asset.assetClass === value),
        sortKey,
      )[0]?.symbol ?? assets[0].symbol,
    )
  }

  const handleSortChange = (value: SortKey) => {
    setSortKey(value)
    setSelectedSymbol(sortAssets(visibleAssets, value)[0]?.symbol ?? selectedSymbol)
  }

  return (
    <main className="app-shell">
      <nav className="topbar" aria-label="Primary navigation">
        <div className="brand">
          <span className="brand-mark">
            <LineChart size={20} />
          </span>
          <span>Folio</span>
        </div>
        <div className="nav-links">
          <a href="#markets">Markets</a>
          <a href="#portfolio">Portfolio</a>
          <a href="#intelligence">Intelligence</a>
        </div>
        <div className="toolbar-actions">
          <button className="ghost-button" type="button">
            <span className="live-dot" aria-hidden="true" />
            Live
          </button>
          <button className="icon-button" type="button" aria-label="Notifications">
            <Bell size={16} />
          </button>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">
            <Sparkles size={14} /> Unified market intelligence
          </span>
          <h1>Markets, beautifully.</h1>
          <p>
            Folio brings crypto rankings, equity fundamentals, sector flows, and your portfolio
            into one luminous dashboard — designed with depth, light, and clarity.
          </p>
          <div className="hero-actions">
            <a className="primary-button" href="#markets">
              Explore markets
              <ArrowUpRight size={16} />
            </a>
            <a className="secondary-button" href="#portfolio">
              Review portfolio
            </a>
          </div>
        </div>

        <article className="hero-card glass">
          <div className="card-heading">
            <span>Global market pulse</span>
            <span className="live-pill">Live</span>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={sentimentSeries}>
              <defs>
                <linearGradient id="pulse" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#5e5ce6" stopOpacity={0.55} />
                  <stop offset="100%" stopColor="#5e5ce6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(28,16,60,.08)" vertical={false} />
              <XAxis dataKey="time" tickLine={false} axisLine={false} />
              <YAxis hide domain={[50, 85]} />
              <Tooltip content={<ChartTooltip />} />
              <Area
                type="monotone"
                dataKey="sentiment"
                stroke="#5e5ce6"
                strokeWidth={3}
                fill="url(#pulse)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </article>
      </section>

      <section className="metrics-grid" aria-label="Market overview metrics">
        <MetricCard
          icon={<Globe2 size={20} />}
          label="Tracked market cap"
          value={formatCurrency(totals.marketCap, true)}
          detail={`${assets.length} crypto, stocks, and ETFs`}
        />
        <MetricCard
          icon={<Activity size={20} />}
          label="24h traded volume"
          value={formatCurrency(totals.volume, true)}
          detail="Aggregated across demo universe"
        />
        <MetricCard
          icon={<TrendingUp size={20} />}
          label="Assets up today"
          value={`${totals.gainers}/${assets.length}`}
          detail="Positive 24h price movement"
        />
        <MetricCard
          icon={<ShieldCheck size={20} />}
          label="Market confidence"
          value={`${totals.averageSentiment}/100`}
          detail="Composite momentum and news score"
        />
      </section>

      <section className="dashboard-grid">
        <section className="panel glass market-panel" id="markets">
          <div className="section-header">
            <div>
              <span className="eyebrow">
                <BarChart3 size={14} /> Ranked assets
              </span>
              <h2>Crypto, stocks &amp; ETFs</h2>
            </div>
            <div className="filters">
              <label className="search-box">
                <Search size={16} />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search BTC, Apple, AI…"
                />
              </label>
              <div className="segmented" role="tablist" aria-label="Market filter">
                {(Object.entries(classLabels) as Array<[AssetClass | 'all', string]>).map(
                  ([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      role="tab"
                      aria-selected={assetClass === value}
                      className={assetClass === value ? 'active' : ''}
                      onClick={() => handleMarketChange(value)}
                    >
                      {label}
                    </button>
                  ),
                )}
              </div>
              <label className="select-box">
                <span>Sort</span>
                <select
                  value={sortKey}
                  onChange={(event) => handleSortChange(event.target.value as SortKey)}
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown size={14} />
              </label>
            </div>
          </div>

          <div className="asset-table">
            <div className="table-head">
              <span>#</span>
              <span>Asset</span>
              <span>Price</span>
              <span>24h</span>
              <span>7d</span>
              <span>Risk</span>
              <span>Market cap</span>
              <span>Volume</span>
              <span>Watch</span>
            </div>
            {visibleAssets.length ? (
              visibleAssets.map((asset, index) => (
                <div
                  className={`table-row ${selectedAsset.symbol === asset.symbol ? 'active' : ''}`}
                  key={asset.symbol}
                  onClick={() => setSelectedSymbol(asset.symbol)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      setSelectedSymbol(asset.symbol)
                    }
                  }}
                  role="button"
                  tabIndex={0}
                >
                  <span>{index + 1}</span>
                  <span className="asset-identity">
                    <span className={`asset-logo ${asset.assetClass}`}>
                      {asset.assetClass === 'crypto' ? <Bitcoin size={18} /> : <Building2 size={18} />}
                    </span>
                    <span>
                      <strong>{asset.name}</strong>
                      <small>
                        {asset.symbol} · {asset.exchange}
                      </small>
                    </span>
                  </span>
                  <span>{formatCurrency(asset.price)}</span>
                  <Change value={asset.change24h} />
                  <Change value={asset.change7d} />
                  <span className="risk-cell">{asset.riskScore}/100</span>
                  <span>{formatCurrency(asset.marketCap, true)}</span>
                  <span>{formatCurrency(asset.volume24h, true)}</span>
                  <span>
                    <button
                      className={`star-button ${watchlist.includes(asset.symbol) ? 'saved' : ''}`}
                      onClick={(event) => {
                        event.stopPropagation()
                        toggleWatchlist(asset.symbol)
                      }}
                      aria-label={`Toggle ${asset.symbol} watchlist`}
                    >
                      <Star size={16} fill="currentColor" />
                    </button>
                  </span>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <strong>No assets match this view.</strong>
                <span>Clear the search or switch markets to reload the ranking table.</span>
              </div>
            )}
          </div>
        </section>

        <aside className="detail-panel glass">
          <div className="detail-title">
            <span className={`asset-logo large ${selectedAsset.assetClass}`}>
              {selectedAsset.assetClass === 'crypto' ? <Bitcoin /> : <Building2 />}
            </span>
            <div>
              <span className="eyebrow">{selectedAsset.assetClass.toUpperCase()}</span>
              <h2>{selectedAsset.name}</h2>
              <p>
                {selectedAsset.symbol} · {selectedAsset.exchange}
              </p>
            </div>
          </div>

          <div className="price-line">
            <strong>{formatCurrency(selectedAsset.price)}</strong>
            <Change value={selectedAsset.change24h} />
          </div>

          <ResponsiveContainer width="100%" height={210}>
            <RechartsLineChart data={selectedSparkline}>
              <defs>
                <linearGradient id="lineStrokePos" x1="0" x2="1" y1="0" y2="0">
                  <stop offset="0%" stopColor="#30d158" />
                  <stop offset="100%" stopColor="#5ac8fa" />
                </linearGradient>
                <linearGradient id="lineStrokeNeg" x1="0" x2="1" y1="0" y2="0">
                  <stop offset="0%" stopColor="#ff375f" />
                  <stop offset="100%" stopColor="#ff9f0a" />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(28,16,60,.08)" vertical={false} />
              <XAxis dataKey="day" tickLine={false} axisLine={false} />
              <YAxis hide domain={['dataMin - 2', 'dataMax + 2']} />
              <Tooltip content={<ChartTooltip />} />
              <Line
                type="monotone"
                dataKey="price"
                stroke={selectedAsset.change7d >= 0 ? 'url(#lineStrokePos)' : 'url(#lineStrokeNeg)'}
                strokeWidth={3}
                dot={false}
              />
            </RechartsLineChart>
          </ResponsiveContainer>

          <div className="detail-stats">
            <Stat label="Market cap" value={formatCurrency(selectedAsset.marketCap, true)} />
            <Stat label="Volume" value={formatCurrency(selectedAsset.volume24h, true)} />
            <Stat label="Risk" value={`${selectedAsset.riskScore}/100`} />
            <Stat label="Sentiment" value={`${selectedAsset.sentiment}/100`} />
          </div>
        </aside>
      </section>

      <section className="insights-grid" id="portfolio">
        <article className="panel glass">
          <div className="section-header compact">
            <div>
              <span className="eyebrow">
                <WalletCards size={14} /> Portfolio
              </span>
              <h2>{formatCurrency(portfolioValue)}</h2>
            </div>
            <Change value={(portfolioGain / (portfolioValue - portfolioGain)) * 100} />
          </div>
          <div className="portfolio-list">
            {portfolioRows.map((holding) => (
              <div className="portfolio-row" key={holding.symbol}>
                <div>
                  <strong>{holding.asset.symbol}</strong>
                  <small>{holding.quantity.toLocaleString()} units</small>
                </div>
                <div>
                  <strong>{formatCurrency(holding.value)}</strong>
                  <Change value={holding.gainPercent} />
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="panel glass">
          <div className="section-header compact">
            <div>
              <span className="eyebrow">
                <Flame size={14} /> Sector heatmap
              </span>
              <h2>Where capital rotates</h2>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={sectorSummaries} layout="vertical" margin={{ left: 20 }}>
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="name"
                width={112}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="change24h" radius={[0, 12, 12, 0]}>
                {sectorSummaries.map((sector, index) => (
                  <Cell key={sector.name} fill={heatColors[index % heatColors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </article>

        <article className="panel glass watchlist-card">
          <div className="section-header compact">
            <div>
              <span className="eyebrow">
                <Star size={14} /> Watchlist
              </span>
              <h2>{watchlist.length} saved</h2>
            </div>
          </div>
          <div className="watchlist-list">
            {watchlist.map((symbol) => {
              const asset = assets.find((item) => item.symbol === symbol)!

              return (
                <button key={symbol} type="button" onClick={() => setSelectedSymbol(symbol)}>
                  <span>
                    <strong>{asset.symbol}</strong>
                    <small>{asset.name}</small>
                  </span>
                  <Change value={asset.change24h} />
                </button>
              )
            })}
          </div>
        </article>
      </section>

      <section className="panel glass intelligence-panel" id="intelligence">
        <div className="section-header">
          <div>
            <span className="eyebrow">
              <BriefcaseBusiness size={14} /> Market intelligence
            </span>
            <h2>Signals worth watching</h2>
          </div>
          <span className="refresh-pill">
            <Clock3 size={14} /> Updated 1 min ago
          </span>
        </div>
        <div className="news-grid">
          {newsItems.map((item) => (
            <article key={item.title} className="news-card">
              <span>{item.source}</span>
              <h3>{item.title}</h3>
              <p>{item.summary}</p>
              <strong>{item.impact}</strong>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}

function MetricCard({
  icon,
  label,
  value,
  detail,
}: {
  icon: ReactNode
  label: string
  value: string
  detail: string
}) {
  return (
    <article className="metric-card glass">
      <span>{icon}</span>
      <div>
        <small>{label}</small>
        <strong>{value}</strong>
        <p>{detail}</p>
      </div>
    </article>
  )
}

function Change({ value }: { value: number }) {
  const positive = value >= 0

  return (
    <span className={`change ${positive ? 'positive' : 'negative'}`}>
      {positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
      {formatPercent(value)}
    </span>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="stat">
      <small>{label}</small>
      <strong>{value}</strong>
    </div>
  )
}

type TooltipPayload = Array<{ value: string | number }>

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: TooltipPayload
  label?: string | number
}) {
  if (!active || !payload?.length) {
    return null
  }

  return (
    <div className="chart-tooltip">
      <small>{label}</small>
      <strong>{payload[0].value}</strong>
    </div>
  )
}

export default App
