import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, Cell
} from 'recharts';
import { useCrypto } from '../context/CryptoContext';

// ── Color palette ────────────────────────────────────────────────────────────
const YELLOW = '#F5C400';   // TIP brand yellow — reserved for the top coin
const PALETTE = [            // all other bars cycle through these
  '#AAAAAA', '#C49B00', '#808080', '#FFD740',
  '#D4A800', '#636363', '#F0C000', '#999999', '#E6B800',
];

// ── Currency helpers ─────────────────────────────────────────────────────────
const CURRENCY_META = {
  USD: { symbol: '$', locale: 'en-US' },
  EUR: { symbol: '€', locale: 'de-DE' },
  GBP: { symbol: '£', locale: 'en-GB' },
};

const getMeta = (currency) =>
  CURRENCY_META[(currency || 'USD').toUpperCase()] ?? CURRENCY_META.USD;

/** Full Intl formatter — used in the Tooltip */
const makeFormatter = (currency) => {
  const { locale } = getMeta(currency);
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: (currency || 'USD').toUpperCase(),
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  });
};

/** Compact tick formatter — used on the Y-Axis */
const makeTickFormatter = (currency) => {
  const { symbol } = getMeta(currency);
  return (v) => {
    if (!isFinite(v) || v <= 0) return '';
    if (v >= 1_000_000) return `${symbol}${(v / 1_000_000).toFixed(1)}M`;
    if (v >= 1_000) return `${symbol}${(v / 1_000).toFixed(0)}k`;
    if (v >= 1) return `${symbol}${v.toFixed(2)}`;
    return `${symbol}${v.toFixed(4)}`;
  };
};

// ── Custom Tooltip ────────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label, formatter }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="custom-tooltip">
      <p className="font-semibold text-sm mb-1" style={{ color: YELLOW }}>{label}</p>
      <p className="text-white text-base font-bold">
        {formatter.format(payload[0].value)}
      </p>
    </div>
  );
};

// ── Component ─────────────────────────────────────────────────────────────────
const MarketChart = () => {
  const { coins, currency } = useCrypto();

  if (!coins.length) return null;

  const chartData = coins.map(coin => ({
    name: coin.symbol.toUpperCase(),
    price: coin.current_price,
  }));

  // Index of the highest-priced coin → gets the yellow brand color
  const maxIdx = chartData.reduce(
    (best, d, i) => (d.price > chartData[best].price ? i : best), 0
  );

  const tickFormatter = makeTickFormatter(currency);
  const intlFormatter = makeFormatter(currency);
  const currencyLabel = (currency || 'USD').toUpperCase();

  return (
    <div className="glass-card p-6 mt-6 transition-all duration-300">
      {/* Header */}
      <div className="mb-5 flex items-center gap-3">
        <div className="w-1 h-8 rounded-full flex-shrink-0" style={{ background: YELLOW }} />
        <div>
          <h2 className="text-white font-semibold text-lg">Price Comparison</h2>
          <p className="text-sm" style={{ color: '#808080' }}>
            Top 10 by market cap · logarithmic scale · prices in {currencyLabel}
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.04)"
              vertical={false}
            />
            <XAxis
              dataKey="name"
              tick={{ fill: '#808080', fontSize: 12, fontWeight: 600 }}
              axisLine={{ stroke: 'rgba(255,255,255,0.08)' }}
              tickLine={false}
            />
            {/*
              Logarithmic scale — essential so Bitcoin ($56k) doesn't
              dwarf Ethereum ($1.6k) and USDT ($1.00).
              domain=['auto','auto'] lets Recharts auto-fit the visible range.
            */}
            <YAxis
              scale="log"
              domain={['auto', 'auto']}
              tick={{ fill: '#808080', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={tickFormatter}
              allowDataOverflow
              width={70}
            />
            <Tooltip
              content={<CustomTooltip formatter={intlFormatter} />}
              cursor={{ fill: 'rgba(245,196,0,0.05)' }}
            />
            {/*
              minPointSize={5} guarantees even USDT ($1.00) renders
              as a visible bar and is hoverable/selectable.
            */}
            <Bar dataKey="price" radius={[6, 6, 0, 0]} maxBarSize={48} minPointSize={5}>
              {chartData.map((_, i) => (
                <Cell
                  key={`cell-${i}`}
                  fill={i === maxIdx ? YELLOW : PALETTE[(i < maxIdx ? i : i - 1) % PALETTE.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MarketChart;
