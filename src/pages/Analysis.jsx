import MarketChart from '../components/MarketChart';
import { useCrypto } from '../context/CryptoContext';
import { useFetchCrypto } from '../hooks/useFetchCrypto';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';

function Analysis() {
  const { loading } = useFetchCrypto();
  const { coins, currency } = useCrypto();

  const currencySymbol = currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : '$';

  const topGainer = coins.reduce((best, coin) =>
    (coin.price_change_percentage_24h > (best?.price_change_percentage_24h ?? -Infinity)) ? coin : best
    , null);
  const topLoser = coins.reduce((worst, coin) =>
    (coin.price_change_percentage_24h < (worst?.price_change_percentage_24h ?? Infinity)) ? coin : worst
    , null);
  const totalMarketCap = coins.reduce((sum, c) => sum + c.market_cap, 0);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
      <div className="spinner" />
      <p className="mt-4 tracking-widest text-sm animate-pulse" style={{ color: '#F5C400' }}>
        LOADING ANALYSIS...
      </p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Header */}
      <div className="mb-8 flex items-start gap-4">
        <div className="w-1 h-12 rounded-full flex-shrink-0 mt-0.5" style={{ background: '#F5C400' }} />
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
            Market <span className="text-gradient">Analysis</span>
          </h1>
          <p className="text-tip-gray text-sm mt-1">Insights from the top 10 cryptocurrencies</p>
        </div>
      </div>

      {/* Highlight Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">

        {/* Total Market Cap — yellow accent */}
        <div className="glass-card p-6"
          style={{ borderLeft: '3px solid #F5C400' }}>
          <div className="flex items-center gap-2 mb-3">
            <Activity className="w-4 h-4" style={{ color: '#F5C400' }} />
            <p className="text-tip-gray text-sm">Total Market Cap</p>
          </div>
          <p className="text-white text-2xl font-black">
            {currencySymbol}{(totalMarketCap / 1e12).toFixed(2)}T
          </p>
        </div>

        {/* Top Gainer */}
        {topGainer && (
          <div className="glass-card p-6" style={{ borderLeft: '3px solid #22c55e' }}>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <p className="text-tip-gray text-sm">Top Gainer 24h</p>
            </div>
            <div className="flex items-center gap-2.5">
              <img src={topGainer.image} alt={topGainer.name} className="w-9 h-9 rounded-full" />
              <div>
                <p className="text-white font-bold">{topGainer.name}</p>
                <p className="text-emerald-400 font-semibold text-sm">
                  +{topGainer.price_change_percentage_24h?.toFixed(2)}%
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Top Loser */}
        {topLoser && (
          <div className="glass-card p-6" style={{ borderLeft: '3px solid #ef4444' }}>
            <div className="flex items-center gap-2 mb-3">
              <TrendingDown className="w-4 h-4 text-red-400" />
              <p className="text-tip-gray text-sm">Top Loser 24h</p>
            </div>
            <div className="flex items-center gap-2.5">
              <img src={topLoser.image} alt={topLoser.name} className="w-9 h-9 rounded-full" />
              <div>
                <p className="text-white font-bold">{topLoser.name}</p>
                <p className="text-red-400 font-semibold text-sm">
                  {topLoser.price_change_percentage_24h?.toFixed(2)}%
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Chart */}
      <MarketChart />

      {/* Data Table */}
      <div className="glass-card mt-6 overflow-hidden">
        {/* Table header — yellow stripe */}
        <div className="p-5 border-b flex items-center gap-3"
          style={{ borderColor: 'rgba(245,196,0,0.15)' }}>
          <div className="w-1 h-5 rounded-full" style={{ background: '#F5C400' }} />
          <h2 className="text-white font-semibold">Detailed Breakdown</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                {['#', 'Asset', 'Price', '24h Change', 'Market Cap', 'Volume 24h'].map((h, i) => (
                  <th key={h}
                    className={`text-xs font-semibold px-5 py-3 ${i < 2 ? 'text-left' : 'text-right'} ${i >= 4 ? 'hidden sm:table-cell' : ''} ${i === 5 ? 'hidden md:table-cell' : ''}`}
                    style={{ color: '#808080' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {coins.map((coin, index) => {
                const isPositive = coin.price_change_percentage_24h >= 0;
                return (
                  <tr key={coin.id}
                    className="border-b transition-colors"
                    style={{ borderColor: 'rgba(255,255,255,0.04)' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(245,196,0,0.03)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td className="px-5 py-3.5 text-sm" style={{ color: '#808080' }}>{index + 1}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <img src={coin.image} alt={coin.name} className="w-6 h-6 rounded-full" />
                        <span className="text-white text-sm font-semibold">{coin.name}</span>
                        <span className="text-xs uppercase" style={{ color: '#808080' }}>{coin.symbol}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-right text-white text-sm font-semibold">
                      {currencySymbol}{coin.current_price.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: coin.current_price < 1 ? 6 : 2,
                      })}
                    </td>
                    <td className={`px-5 py-3.5 text-right text-sm font-bold ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                      {isPositive ? '+' : ''}{coin.price_change_percentage_24h?.toFixed(2)}%
                    </td>
                    <td className="px-5 py-3.5 text-right text-sm hidden sm:table-cell" style={{ color: '#AAAAAA' }}>
                      {currencySymbol}{(coin.market_cap / 1e9).toFixed(2)}B
                    </td>
                    <td className="px-5 py-3.5 text-right text-sm hidden md:table-cell" style={{ color: '#AAAAAA' }}>
                      {currencySymbol}{(coin.total_volume / 1e9).toFixed(2)}B
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Analysis;