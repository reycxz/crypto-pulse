import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, Dot
} from 'recharts';
import { useCrypto } from '../context/CryptoContext';

// ── Color palette ────────────────────────────────────────────────────────────
const YELLOW = '#F5C400';   // TIP brand yellow

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

// ── Custom Dot — highlights the highest-price point in brand yellow ───────────
const CustomDot = ({ cx, cy, index, maxIdx }) => {
  const isMax = index === maxIdx;
  return (
    <Dot
      cx={cx}
      cy={cy}
      r={isMax ? 6 : 4}
      fill={isMax ? YELLOW : '#1a1a1a'}
      stroke={isMax ? YELLOW : 'rgba(245,196,0,0.5)'}
      strokeWidth={2}
    />
  );
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

  // Index of the highest-priced coin → gets the yellow brand accent
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
          <h2 className="text-white font-semibold text-lg">Price Trend</h2>
          <p className="text-sm" style={{ color: '#808080' }}>
            Top 10 by market cap · logarithmic scale · prices in {currencyLabel}
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
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
              cursor={{ stroke: 'rgba(245,196,0,0.15)', strokeWidth: 2 }}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke={YELLOW}
              strokeWidth={2.5}
              dot={<CustomDot maxIdx={maxIdx} />}
              activeDot={{ r: 7, fill: YELLOW, stroke: '#1a1a1a', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MarketChart;
