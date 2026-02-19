import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell
} from 'recharts';
import { useCrypto } from '../context/CryptoContext';

// TIP-palette bar colors: yellow primary, gray variations, white
const COLORS = [
  '#F5C400', '#AAAAAA', '#C49B00', '#808080', '#FFD740',
  '#D4A800', '#636363', '#F0C000', '#999999', '#E6B800'
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="font-semibold text-sm mb-1" style={{ color: '#F5C400' }}>{label}</p>
        <p className="text-white text-base font-bold">
          ${payload[0].value.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </p>
      </div>
    );
  }
  return null;
};

const MarketChart = () => {
  const { coins } = useCrypto();
  const chartData = coins.map(coin => ({
    name: coin.symbol.toUpperCase(),
    price: coin.current_price,
  }));

  if (chartData.length === 0) return null;

  return (
    <div className="glass-card p-6 mt-6 glow-yellow transition-all duration-300">
      <div className="mb-5 flex items-center gap-3">
        {/* yellow accent bar — echoes TIP logo stripe */}
        <div className="w-1 h-8 rounded-full bg-tip-yellow flex-shrink-0" />
        <div>
          <h2 className="text-white font-semibold text-lg">Price Comparison</h2>
          <p className="text-tip-gray text-sm">Top 10 by market cap</p>
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
              tickFormatter={(v) => `$${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v.toFixed(0)}`}
              width={60}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(245, 196, 0, 0.05)' }} />
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
