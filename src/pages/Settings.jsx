import { useCrypto } from '../context/CryptoContext';

function Settings() {
  const { currency, setCurrency } = useCrypto();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-white mb-6">Settings</h1>
      <div className="bg-gray-800 p-4 rounded-lg">
        <label className="block text-sm text-gray-300 mb-2">Display Currency</label>
        <div className="flex gap-3">
          {['USD', 'EUR', 'GBP'].map(c => (
            <button
              key={c}
              onClick={() => setCurrency(c)}
              className={`px-4 py-2 rounded ${currency === c ? 'bg-cyan-400 text-black' : 'bg-gray-700 text-white'}`}>
              {c}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Settings;
