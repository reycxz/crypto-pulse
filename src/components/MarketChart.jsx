import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell
} from 'recharts';
import { useCrypto } from '../context/CryptoContext';

// TIP-palette bar colors: yellow primary, gray variations, gold tones
const COLORS = [
  '#F5C400', '#AAAAAA', '#C49B00', '#808080', '#FFD740',
  '#D4A800', '#636363', '#F0C000', '#999999', '#E6B800'
];

// Helper: currency code → symbol
const getCurrencySymbol = (currency) => {
  switch ((currency || 'USD').toUpperCase()) {
    case 'EUR': return '€';
    case 'GBP': return '£';
    default: return '$';
  }
};

// Helper: Y-axis tick formatter — uses correct symbol + k/M suffix
const makeTickFormatter = (symbol) => (v) => {
  if (v >= 1_000_000) return `${symbol}${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `${symbol}${(v / 1_000).toFixed(0)}k`;
  return `${symbol}${v.toFixed(0)}`;
};

// Custom tooltip — receives symbol via closure
const makeTooltip = (symbol) => ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const val = payload[0].value;
    return (
      <div className="custom-tooltip">
        <p className="font-semibold text-sm mb-1" style={{ color: '#F5C400' }}>{label}</p>
        <p className="text-white text-base font-bold">
          {symbol}{val.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: val < 1 ? 6 : 2,
          })}
        </p>
      </div>
    );
  }
  return null;
};

const MarketChart = () => {
  const { coins, currency } = useCrypto();
  const symbol = getCurrencySymbol(currency);

  const chartData = coins.map(coin => ({
    name: coin.symbol.toUpperCase(),
    price: coin.current_price,
  }));

  if (chartData.length === 0) return null;

  // Dynamically compute Y-axis domain with 10% headroom
  const maxPrice = Math.max(...chartData.map(d => d.price));
  const yDomain = [0, Math.ceil(maxPrice * 1.1)];

  const CustomTooltip = makeTooltip(symbol);

  return (
    <div className="glass-card p-6 mt-6 transition-all duration-300">
      <div className="mb-5 flex items-center gap-3">
        <div className="w-1 h-8 rounded-full flex-shrink-0" style={{ background: '#F5C400' }} />
        <div>
          <h2 className="text-white font-semibold text-lg">Price Comparison</h2>
          <p className="text-sm" style={{ color: '#808080' }}>
            Top 10 by market cap · prices in {currency.toUpperCase()}
          </p>
        </div>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fill: '#808080', fontSize: 12, fontWeight: 600 }}
              axisLine={{ stroke: 'rgba(255,255,255,0.08)' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: '#808080', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={makeTickFormatter(symbol)}
              domain={yDomain}
              width={65}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(245,196,0,0.05)' }} />
            <Bar dataKey="price" radius={[6, 6, 0, 0]} maxBarSize={48}>
              {chartData.map((_, i) => (
                <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MarketChart;
