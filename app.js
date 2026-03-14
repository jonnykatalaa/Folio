const assets = [
  {
    name: "Bitcoin",
    symbol: "BTC",
    type: "crypto",
    price: 72455.28,
    holdings: 0.82,
    change24h: 2.14,
    change7d: 6.89,
    color: "#f7931a",
  },
  {
    name: "Ethereum",
    symbol: "ETH",
    type: "crypto",
    price: 3898.55,
    holdings: 6.4,
    change24h: -0.78,
    change7d: 4.12,
    color: "#627eea",
  },
  {
    name: "Solana",
    symbol: "SOL",
    type: "crypto",
    price: 188.31,
    holdings: 95,
    change24h: 4.45,
    change7d: 12.56,
    color: "#14f195",
  },
  {
    name: "Apple",
    symbol: "AAPL",
    type: "stocks",
    price: 226.37,
    holdings: 185,
    change24h: 0.64,
    change7d: 2.08,
    color: "#9ea3a8",
  },
  {
    name: "NVIDIA",
    symbol: "NVDA",
    type: "stocks",
    price: 924.11,
    holdings: 53,
    change24h: 1.83,
    change7d: 9.37,
    color: "#76b900",
  },
  {
    name: "Microsoft",
    symbol: "MSFT",
    type: "stocks",
    price: 414.63,
    holdings: 120,
    change24h: -0.22,
    change7d: 1.62,
    color: "#00a4ef",
  },
  {
    name: "Gold",
    symbol: "XAU",
    type: "commodities",
    price: 2187.5,
    holdings: 8.4,
    change24h: 0.95,
    change7d: 1.34,
    color: "#f5b400",
  },
  {
    name: "Silver",
    symbol: "XAG",
    type: "commodities",
    price: 24.61,
    holdings: 950,
    change24h: -0.31,
    change7d: -1.12,
    color: "#c0c0c0",
  },
  {
    name: "Crude Oil",
    symbol: "WTI",
    type: "commodities",
    price: 81.93,
    holdings: 140,
    change24h: 1.19,
    change7d: 2.64,
    color: "#885f2f",
  },
  {
    name: "USD Cash",
    symbol: "USD",
    type: "cash",
    price: 1,
    holdings: 12480.4,
    change24h: 0,
    change7d: 0,
    color: "#4a90e2",
  },
  {
    name: "EUR Cash",
    symbol: "EUR",
    type: "cash",
    price: 1.09,
    holdings: 4720.12,
    change24h: 0.03,
    change7d: -0.04,
    color: "#2d7ff9",
  },
  {
    name: "US Treasury Bill",
    symbol: "T-BILL",
    type: "cash",
    price: 100.1,
    holdings: 300,
    change24h: 0.02,
    change7d: 0.1,
    color: "#6ea8fe",
  },
];

const filters = ["all", "crypto", "stocks", "commodities", "cash"];

const state = {
  query: "",
  type: "all",
  sort: "valueDesc",
};

const moneyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const numberFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 4,
});

function toValue(asset) {
  return asset.price * asset.holdings;
}

function pctClass(value) {
  return value < 0 ? "negative" : "positive";
}

function signedPercent(value) {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}

function totalValue(dataset) {
  return dataset.reduce((sum, asset) => sum + toValue(asset), 0);
}

function getFilteredAssets() {
  const q = state.query.trim().toLowerCase();

  return assets.filter((asset) => {
    const matchesType = state.type === "all" || asset.type === state.type;
    const matchesQuery =
      !q ||
      asset.name.toLowerCase().includes(q) ||
      asset.symbol.toLowerCase().includes(q);
    return matchesType && matchesQuery;
  });
}

function getSortedAssets(dataset) {
  const sorted = [...dataset];

  switch (state.sort) {
    case "valueAsc":
      sorted.sort((a, b) => toValue(a) - toValue(b));
      break;
    case "changeDesc":
      sorted.sort((a, b) => b.change24h - a.change24h);
      break;
    case "changeAsc":
      sorted.sort((a, b) => a.change24h - b.change24h);
      break;
    case "nameAsc":
      sorted.sort((a, b) => a.name.localeCompare(b.name));
      break;
    default:
      sorted.sort((a, b) => toValue(b) - toValue(a));
      break;
  }

  return sorted;
}

function renderFilters() {
  const host = document.getElementById("typeFilters");
  host.innerHTML = filters
    .map((filter) => {
      const active = filter === state.type ? "active" : "";
      const label = filter.charAt(0).toUpperCase() + filter.slice(1);
      return `<button class="chip-btn ${active}" data-type="${filter}">${label}</button>`;
    })
    .join("");

  host.querySelectorAll(".chip-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.type = btn.dataset.type;
      render();
    });
  });
}

function renderSummary(dataset) {
  const host = document.getElementById("summaryGrid");
  const gross = totalValue(dataset);
  const total = totalValue(assets);

  const dayPnL = dataset.reduce(
    (sum, asset) => sum + toValue(asset) * (asset.change24h / 100),
    0,
  );

  const dayPnLPct = total ? (dayPnL / total) * 100 : 0;
  const topAsset = [...dataset].sort((a, b) => b.change24h - a.change24h)[0];
  const byType = allocationByType(dataset);
  const diversifiedShare = Object.values(byType).filter((v) => v / gross > 0.1)
    .length;

  host.innerHTML = `
    <article class="summary-card">
      <span>Portfolio Balance</span>
      <strong>${moneyFormatter.format(total)}</strong>
    </article>
    <article class="summary-card">
      <span>24h Profit / Loss</span>
      <strong class="${pctClass(dayPnL)}">${moneyFormatter.format(dayPnL)}</strong>
      <span class="trend ${pctClass(dayPnLPct)}">${signedPercent(dayPnLPct)}</span>
    </article>
    <article class="summary-card">
      <span>Diversification Score</span>
      <strong>${Math.min(100, diversifiedShare * 22 + 18)}/100</strong>
    </article>
    <article class="summary-card">
      <span>Best Performer</span>
      <strong>${topAsset ? `${topAsset.symbol} (${signedPercent(topAsset.change24h)})` : "N/A"}</strong>
    </article>
  `;

  const headlineStats = document.getElementById("headlineStats");
  headlineStats.innerHTML = `
    <div class="headline-pill">Assets <strong>${dataset.length}</strong></div>
    <div class="headline-pill">Visible Value <strong>${moneyFormatter.format(gross)}</strong></div>
    <div class="headline-pill">Market Snapshot <strong>Mixed</strong></div>
  `;
}

function renderTable(dataset) {
  const body = document.getElementById("assetRows");
  const total = totalValue(assets);

  if (!dataset.length) {
    body.innerHTML = `
      <tr>
        <td colspan="8" class="empty-state">No assets found for this filter.</td>
      </tr>
    `;
    return;
  }

  body.innerHTML = dataset
    .map((asset, index) => {
      const value = toValue(asset);
      const allocationPct = total ? (value / total) * 100 : 0;

      return `
        <tr>
          <td>${index + 1}</td>
          <td>
            <div class="asset-meta">
              <div class="asset-icon" style="background:${asset.color}; color:#0b1426;">${asset.symbol.slice(0, 2)}</div>
              <div class="asset-name">
                <strong>${asset.name}</strong>
                <div><span>${asset.symbol}</span><span class="type-badge">${asset.type}</span></div>
              </div>
            </div>
          </td>
          <td>${moneyFormatter.format(asset.price)}</td>
          <td class="${pctClass(asset.change24h)}">${signedPercent(asset.change24h)}</td>
          <td class="${pctClass(asset.change7d)}">${signedPercent(asset.change7d)}</td>
          <td>${numberFormatter.format(asset.holdings)}</td>
          <td>${moneyFormatter.format(value)}</td>
          <td class="allocation-cell">
            <div class="allocation-track">
              <div class="allocation-fill" style="width: ${Math.max(1, allocationPct)}%"></div>
            </div>
            <small>${allocationPct.toFixed(2)}%</small>
          </td>
        </tr>
      `;
    })
    .join("");
}

function allocationByType(dataset) {
  return dataset.reduce((acc, asset) => {
    acc[asset.type] = (acc[asset.type] || 0) + toValue(asset);
    return acc;
  }, {});
}

function renderAllocation(dataset) {
  const totals = allocationByType(dataset);
  const colors = {
    crypto: "#2f80ed",
    stocks: "#16c784",
    commodities: "#f5b400",
    cash: "#9ca3af",
  };

  const total = Object.values(totals).reduce((sum, v) => sum + v, 0);
  const entries = Object.entries(totals).sort((a, b) => b[1] - a[1]);

  let start = 0;
  const segments = entries.map(([type, value]) => {
    const pct = total ? (value / total) * 100 : 0;
    const end = start + pct;
    const segment = `${colors[type]} ${start.toFixed(2)}% ${end.toFixed(2)}%`;
    start = end;
    return segment;
  });

  const donut = document.getElementById("donutChart");
  donut.style.background = segments.length
    ? `conic-gradient(${segments.join(", ")})`
    : "conic-gradient(#314677 0 360deg)";

  const allocationList = document.getElementById("allocationList");
  allocationList.innerHTML = entries
    .map(([type, value]) => {
      const pct = total ? ((value / total) * 100).toFixed(2) : "0.00";
      return `
        <li class="allocation-item">
          <span class="legend"><span class="legend-dot" style="background:${colors[type]}"></span>${type[0].toUpperCase() + type.slice(1)}</span>
          <span>${pct}%</span>
        </li>
      `;
    })
    .join("");
}

function renderMovers() {
  const movers = [...assets].sort((a, b) => b.change24h - a.change24h).slice(0, 5);
  const host = document.getElementById("moversList");

  host.innerHTML = movers
    .map(
      (asset) => `
      <li class="mover-item">
        <div>
          <strong>${asset.symbol}</strong>
          <div style="color: var(--text-muted); font-size: 0.75rem;">${asset.name}</div>
        </div>
        <div class="${pctClass(asset.change24h)}">${signedPercent(asset.change24h)}</div>
      </li>
    `,
    )
    .join("");
}

function bindControls() {
  document.getElementById("searchInput").addEventListener("input", (event) => {
    state.query = event.target.value;
    render();
  });

  document.getElementById("sortSelect").addEventListener("change", (event) => {
    state.sort = event.target.value;
    render();
  });
}

function render() {
  renderFilters();
  const visible = getSortedAssets(getFilteredAssets());
  renderSummary(visible);
  renderTable(visible);
  renderAllocation(visible);
  renderMovers();
}

bindControls();
render();
