import { useState, useEffect } from 'react';
import { useCrypto } from '../context/CryptoContext';

export const useFetchCrypto = () => {
  const { setCoins, currency } = useCrypto();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const minDelay = 500; // ensure loading shows at least 500ms
    const start = Date.now();

    const fetchMarket = async () => {
      try {
        setLoading(true);
        // Use the dev proxy defined in vite.config.js at /api
        const vs = (currency || 'USD').toLowerCase();
        const res = await fetch(`/api/coins/markets?vs_currency=${vs}&order=market_cap_desc&per_page=10&page=1`);
        if (!res.ok) throw new Error("The Market is closed (API Error)");
        const data = await res.json();
        if (!cancelled) setCoins(data);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        const elapsed = Date.now() - start;
        const wait = Math.max(0, minDelay - elapsed);
        setTimeout(() => {
          if (!cancelled) setLoading(false);
        }, wait);
      }
    };

    fetchMarket();

    return () => {
      cancelled = true;
    };
  }, [setCoins, currency]);

  return { loading, error };
};
