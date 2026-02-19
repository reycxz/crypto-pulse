import { createContext, useState, useContext } from 'react';

const CryptoContext = createContext(null);

export const CryptoProvider = ({ children }) => {
  const [coins, setCoins] = useState([]);
  const [currency, setCurrency] = useState('USD');

  return (
    <CryptoContext.Provider value={{ coins, setCoins, currency, setCurrency }}>
      {children}
    </CryptoContext.Provider>
  );
};

export const useCrypto = () => {
  const ctx = useContext(CryptoContext);
  if (!ctx) throw new Error('useCrypto must be used within a CryptoProvider');
  return ctx;
};
