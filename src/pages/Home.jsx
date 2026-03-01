import { useRef, useEffect } from 'react';
import { useFetchCrypto } from '../hooks/useFetchCrypto';
import { useCrypto } from '../context/CryptoContext';
import MarketChart from '../components/MarketChart';
import useLocalStorage from '../hooks/useLocalStorage';
import { Search, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';

function Home() {
  const { loading, error } = useFetchCrypto();
  const { coins, currency } = useCrypto();
  const [searchTerm, setSearchTerm] = useLocalStorage('cryptoSearchQuery', '');
  const inputRef = useRef(null);

  // Auto-focus search when data loads
  useEffect(() => {
    if (!loading && inputRef.current) inputRef.current.focus();
  }, [loading]);

  const filteredCoins = coins.filter(coin =>
    coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currencySymbol = currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : '$';

  /* ── Loading ── */
  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
      <div className="relative">
        <div className="spinner" />
        <div className="absolute inset-0 rounded-full border-4 animate-ping"
          style={{ borderColor: 'rgba(245,196,0,0.2)' }} />
      </div>
      <p className="mt-6 font-bold tracking-widest text-sm animate-pulse"
        style={{ color: '#F5C400' }}>
        SCANNING BLOCKCHAIN...
      </p>
      <p className="text-tip-gray text-xs mt-1">Fetching live market data</p>
    </div>
  );

  /* ── Error ── */
  if (error) return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-4">
      <div className="glass-card p-8 max-w-md w-full text-center">
        <AlertCircle className="w-12 h-12 mx-auto mb-4" style={{ color: '#F5C400' }} />
        <h2 className="text-white font-semibold text-lg mb-2">Market Feed Unavailable</h2>
        <p className="text-tip-gray text-sm">{error}</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-white">

      {/* Header */}
      <div className="mb-8 flex items-start gap-4">
        <div className="w-1 h-12 rounded-full flex-shrink-0 mt-0.5" style={{ background: '#F5C400' }} />
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
            Crypto <span className="text-gradient">Market</span>
          </h1>
          <p className="text-tip-gray text-sm mt-1">Top 10 cryptocurrencies · Live data</p>
        </div>
      </div>

      {/* Quick-stats strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {coins.slice(0, 4).map(coin => {
          const pos = coin.price_change_percentage_24h >= 0;
          return (
            <div key={coin.id} className="glass-card p-3 flex items-center gap-2.5">
              <img src={coin.image} alt={coin.name}
                className="w-7 h-7 rounded-full ring-2"
                style={{ ringColor: 'rgba(245,196,0,0.3)' }} />
              <div>
                <p className="text-white text-sm font-semibold">{coin.symbol.toUpperCase()}</p>
                <p className={`text-xs font-medium ${pos ? 'text-emerald-400' : 'text-red-400'}`}>
                  {pos ? '+' : ''}{coin.price_change_percentage_24h?.toFixed(2)}%
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4"
          style={{ color: '#808080' }} />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search by name or symbol..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="search-input pl-12"
        />
      </div>

      {/* Chart */}
      <MarketChart />

      {/* Results header */}
      <div className="mt-8 mb-4 flex items-center justify-between">
        <span className="text-white font-semibold">
          {filteredCoins.length} asset{filteredCoins.length !== 1 ? 's' : ''}
        </span>
        {searchTerm && (
          <button onClick={() => setSearchTerm('')}
            className="text-xs text-tip-gray hover:text-white transition-colors">
            Clear search
          </button>
        )}
      </div>

      {/* Coin Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredCoins.map((coin, index) => {
          const isPositive = coin.price_change_percentage_24h >= 0;
          return (
            <div key={coin.id} className="coin-card group">
              {/* Header row */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <img src={coin.image} alt={coin.name}
                    className="w-10 h-10 rounded-full ring-2 transition-all duration-200"
                    style={{ ringColor: 'rgba(245,196,0,0.2)' }} />
                  <div>
                    <h3 className="text-white font-bold text-sm leading-tight">{coin.name}</h3>
                    <p className="text-tip-gray text-xs uppercase tracking-wider mt-0.5">{coin.symbol}</p>
                  </div>
                </div>
                {/* Rank badge — yellow pill */}
                <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{ background: 'rgba(245,196,0,0.15)', color: '#F5C400' }}>
                  #{index + 1}
                </span>
              </div>

              {/* Price */}
              <p className="text-white font-black text-xl mb-1">
                {currencySymbol}{coin.current_price.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: coin.current_price < 1 ? 6 : 2,
                })}
              </p>

              {/* 24h change */}
              <div className={`flex items-center gap-1 ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                <span className="text-sm font-semibold">
                  {isPositive ? '+' : ''}{coin.price_change_percentage_24h?.toFixed(2)}%
                </span>
                <span className="text-xs text-tip-gray ml-1">24h</span>
              </div>

              {/* Market Cap */}
              <div className="mt-3 pt-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                <p className="text-tip-gray text-xs">Market Cap</p>
                <p className="text-tip-gray-light text-sm font-medium mt-0.5">
                  {currencySymbol}{(coin.market_cap / 1e9).toFixed(2)}B
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {filteredCoins.length === 0 && searchTerm && (
        <div className="text-center py-16">
          <p className="text-tip-gray">No coins matching "{searchTerm}"</p>
          <button onClick={() => setSearchTerm('')}
            className="mt-3 text-sm hover:underline"
            style={{ color: '#F5C400' }}>
            Clear search
          </button>
        </div>
      )}
    </div>
  );
}

export default Home;
