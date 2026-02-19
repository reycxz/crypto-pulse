import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { CryptoProvider } from './context/CryptoContext';
import Home from './pages/Home';
import Analysis from './pages/Analysis';
import Settings from './pages/Settings';
import { TrendingUp, BarChart2, Settings2 } from 'lucide-react';

function App() {
  return (
    <CryptoProvider>
      <Router>
        {/* ── Navigation ── */}
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-tip-yellow/20 shadow-2xl"
          style={{ background: 'rgba(10, 10, 10, 0.92)', backdropFilter: 'blur(16px)' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">

              {/* Logo */}
              <div className="flex items-center gap-3">
                {/* TIP yellow stripe accent */}
                <div className="w-1 h-8 rounded-full bg-tip-yellow" />
                <div className="flex flex-col leading-none">
                  <span className="text-white font-black text-lg tracking-widest uppercase">
                    CRYPTO<span className="text-tip-yellow">PULSE</span>
                  </span>
                  <span className="text-tip-gray text-[9px] tracking-[0.2em] uppercase mt-0.5">
                    Market Intelligence
                  </span>
                </div>
              </div>

              {/* Links */}
              <div className="flex items-center gap-1">
                {[
                  { to: '/', end: true, icon: <BarChart2 className="w-4 h-4" />, label: 'Market' },
                  { to: '/analysis', end: false, icon: <TrendingUp className="w-4 h-4" />, label: 'Analysis' },
                  { to: '/settings', end: false, icon: <Settings2 className="w-4 h-4" />, label: 'Settings' },
                ].map(({ to, end, icon, label }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={end}
                    className={({ isActive }) =>
                      `flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                        ? 'bg-tip-yellow text-black shadow-md'
                        : 'text-tip-gray-light hover:text-white hover:bg-white/5'
                      }`
                    }
                  >
                    {icon}
                    {label}
                  </NavLink>
                ))}
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="pt-16 min-h-screen bg-grid">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/analysis" element={<Analysis />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </Router>
    </CryptoProvider>
  );
}

export default App;
