import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useCrypto } from '../context/CryptoContext';

const MarketChart = () => {
  const { coins } = useCrypto();
  const chartData = coins.map(coin => ({
    name: coin.symbol.toUpperCase(),
    price: coin.current_price
  }));

  return (
    <div className="h-80 w-full p-4 bg-gray-800 rounded-xl mt-6">
      <h2 className="text-white mb-4">Price Comparison (USD)</h2>
      <ResponsiveContainer>
        <BarChart data={chartData}>
          <XAxis dataKey="name" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip contentStyle={{backgroundColor: '#1e293b', border: 'none'}} />
          <Bar dataKey="price" fill="#22d3ee" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MarketChart;

