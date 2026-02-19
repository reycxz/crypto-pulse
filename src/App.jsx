import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { CryptoProvider } from './context/CryptoContext';
import Home from './pages/Home';
import Analysis from './pages/Analysis';
import Settings from './pages/Settings';

function App() {
  return (
    <CryptoProvider>
      <Router>
        <nav className="fixed top-0 left-0 right-0 p-5 bg-indigo-900 text-white flex justify-between shadow-lg z-50">
          <h1 className="text-xl font-bold tracking-widest">CRYPTO-PULSE</h1>
          <div className="flex gap-6">
            <Link to="/" className="hover:text-cyan-400">Market</Link>
            <Link to="/analysis" className="hover:text-cyan-400">Analysis</Link>
            <Link to="/settings" className="hover:text-cyan-400">Settings</Link>
          </div>
        </nav>
        <div className="pt-24"> {/* offset for fixed nav */}
          <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/analysis" element={<Analysis />} />
          <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
      </Router>
    </CryptoProvider>
  );
}
export default App;

