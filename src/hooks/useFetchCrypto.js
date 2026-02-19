import { useState, useEffect } from 'react';
import { useCrypto } from '../context/CryptoContext';

export const useFetchCrypto = () => {
  const { setCoins } = useCrypto();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMarket = async () => {
      try {
        // Use the dev proxy defined in vite.config.js at /api
        const res = await fetch('/api/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1');
        if (!res.ok) throw new Error("The Market is closed (API Error)");
        const data = await res.json();
        setCoins(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMarket();
  }, [setCoins]);

  return { loading, error };
};
