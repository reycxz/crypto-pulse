import { useCrypto } from '../context/CryptoContext';
import { Settings2, CheckCircle2 } from 'lucide-react';

const CURRENCIES = [
  { code: 'USD', symbol: '$', label: 'US Dollar', flag: '🇺🇸' },
  { code: 'EUR', symbol: '€', label: 'Euro', flag: '🇪🇺' },
  { code: 'GBP', symbol: '£', label: 'British Pound', flag: '🇬🇧' },
];

function Settings() {
  const { currency, setCurrency } = useCrypto();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8 flex items-start gap-4">
        <div className="w-1 h-12 rounded-full flex-shrink-0 mt-0.5" style={{ background: '#F5C400' }} />
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
            App <span className="text-gradient">Settings</span>
          </h1>
          <p className="text-tip-gray text-sm mt-1">Customize your CryptoPulse experience</p>
        </div>
      </div>

      <div className="max-w-lg">
        <div className="glass-card p-6">
          {/* Section header */}
          <div className="flex items-center gap-2.5 mb-5">
            <Settings2 className="w-5 h-5" style={{ color: '#F5C400' }} />
            <h2 className="text-white font-semibold">Display Currency</h2>
          </div>
          <p className="text-tip-gray text-sm mb-5">
            Changing currency re-fetches live market data automatically.
          </p>

          <div className="flex flex-col gap-3">
            {CURRENCIES.map(({ code, symbol, label, flag }) => {
              const active = currency === code;
              return (
                <button
                  key={code}
                  onClick={() => setCurrency(code)}
                  className="flex items-center justify-between w-full p-4 rounded-xl border text-left transition-all duration-200"
                  style={{
                    borderColor: active ? '#F5C400' : 'rgba(255,255,255,0.08)',
                    background: active ? 'rgba(245,196,0,0.1)' : 'rgba(255,255,255,0.03)',
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{flag}</span>
                    <div>
                      <p className="font-semibold text-sm text-white">{label}</p>
                      <p className="text-xs" style={{ color: '#808080' }}>{code} · {symbol}</p>
                    </div>
                  </div>
                  {active
                    ? <CheckCircle2 className="w-5 h-5 flex-shrink-0" style={{ color: '#F5C400' }} />
                    : <div className="w-5 h-5 rounded-full border-2 flex-shrink-0"
                      style={{ borderColor: '#555' }} />
                  }
                </button>
              );
            })}
          </div>
        </div>

        {/* Color palette reference card */}
        <div className="glass-card p-5 mt-4">
          <p className="text-xs font-semibold mb-3 uppercase tracking-widest"
            style={{ color: '#808080' }}>Brand Palette</p>
          <div className="flex gap-3">
            {[
              { color: '#F5C400', label: 'Yellow' },
              { color: '#111111', label: 'Black', border: true },
              { color: '#808080', label: 'Gray' },
              { color: '#FFFFFF', label: 'White', border: true },
            ].map(({ color, label, border }) => (
              <div key={label} className="flex flex-col items-center gap-1.5">
                <div className="w-8 h-8 rounded-lg"
                  style={{ background: color, border: border ? '1px solid rgba(255,255,255,0.2)' : 'none' }} />
                <span className="text-[10px]" style={{ color: '#808080' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
