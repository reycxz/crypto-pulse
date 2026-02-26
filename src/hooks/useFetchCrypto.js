import { useState, useEffect } from 'react';
import { useCrypto } from '../context/CryptoContext';

export const useFetchCrypto = () => {
  const { setCoins, currency } = useCrypto();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const minDelay = 800; // ensure loading spinner shows at least 800ms
    const start = Date.now();

    const fetchMarket = async () => {
      setLoading(true);
      setError(null);

      try {
        const vs = (currency || 'USD').toLowerCase();
        // Calls our Vercel serverless function which proxies to CoinGecko
        // with the API key kept securely in an environment variable.
        const res = await fetch(
          `/api/markets?vs_currency=${vs}&order=market_cap_desc&per_page=10&page=1`
        );

        if (!res.ok) {
          throw new Error(`API Error ${res.status}: The market feed is unavailable.`);
        }

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
