import { createContext, useState, useContext } from 'react';

const CryptoContext = createContext();

export const CryptoProvider = ({ children }) => {
  const [coins, setCoins] = useState([]);
  const [currency, setCurrency] = useState('USD');

  return (
    <CryptoContext.Provider value={{ coins, setCoins, currency, setCurrency }}>
      {children}
    </CryptoContext.Provider>
  );
};

export const useCrypto = () => useContext(CryptoContext);

