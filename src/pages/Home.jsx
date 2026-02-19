import { useState, useRef, useEffect } from 'react';
import { useFetchCrypto } from '../hooks/useFetchCrypto';
import { useCrypto } from '../context/CryptoContext';
import MarketChart from '../components/MarketChart';

function Home() {
  const { loading, error } = useFetchCrypto();
  const { coins } = useCrypto();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCoins, setFilteredCoins] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!loading) {
      // Only focus when the input is rendered (after loading finishes)
      inputRef.current && inputRef.current.focus();
    }
  }, [loading]);

  useEffect(() => {
    const filtered = coins.filter(coin =>
      coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCoins(filtered);
  }, [coins, searchTerm]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center mt-20">
      <div className="w-12 h-12 border-4 border-t-transparent border-cyan-400 rounded-full animate-spin" />
      <div className="text-white mt-4">Scanning Blockchain...</div>
    </div>
  );
  if (error) return <div className="text-red-500 text-center mt-10">Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-white mb-6">Crypto Market Overview</h1>
      <input
        ref={inputRef}
        type="text"
        placeholder="Search cryptocurrencies..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-3 mb-6 bg-gray-800 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-cyan-400"
      />
      <MarketChart />
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {filteredCoins.map(coin => (
          <li key={coin.id} className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-white font-semibold">{coin.name} ({coin.symbol.toUpperCase()})</h3>
            <p className="text-white">${coin.current_price.toFixed(2)}</p>
            <p className={`text-sm ${coin.price_change_percentage_24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {coin.price_change_percentage_24h.toFixed(2)}%
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Home;
