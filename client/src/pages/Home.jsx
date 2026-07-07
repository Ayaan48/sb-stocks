import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import axiosInstance from '../components/axiosInstance';
import { useGeneral } from '../context/GeneralContext';
import './Home.css';

const Home = () => {
  const { user }            = useGeneral();
  const navigate            = useNavigate();
  const [popular, setPopular]   = useState([]);
  const [search,  setSearch]    = useState('');
  const [results, setResults]   = useState([]);
  const [searching, setSearching] = useState(false);
  const [loadingPop, setLoadingPop] = useState(true);

  useEffect(() => {
    axiosInstance.get('/stocks/popular')
      .then(r => setPopular(r.data))
      .finally(() => setLoadingPop(false));
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!search.trim()) return;
    setSearching(true);
    try {
      const { data } = await axiosInstance.get(`/stocks/search?q=${encodeURIComponent(search)}`);
      setResults(data);
    } catch {
      setResults([]);
    } finally {
      setSearching(false);
    }
  };

  const goToStock = (symbol) => {
    setResults([]);
    setSearch('');
    navigate(`/stock/${symbol}`);
  };

  return (
    <div className="home-page container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
      <div className="home-header">
        <div>
          <h2>Good day, {user?.username} 👋</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '.25rem' }}>
            Virtual balance: <strong style={{ color: 'var(--success)' }}>
              ${user?.balance?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </strong>
          </p>
        </div>
      </div>

      {/* Stock Search */}
      <div className="card search-card">
        <h3>Search Stocks</h3>
        <form className="search-form" onSubmit={handleSearch}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by symbol or company name (e.g. AAPL, Tesla)"
          />
          <button type="submit" className="btn btn-primary" disabled={searching}>
            <FaSearch /> {searching ? 'Searching…' : 'Search'}
          </button>
        </form>

        {results.length > 0 && (
          <div className="search-results">
            {results.map(s => (
              <div key={s.symbol} className="search-result-item" onClick={() => goToStock(s.symbol)}>
                <strong>{s.symbol}</strong>
                <span>{s.shortname}</span>
                <span className="exch">{s.exchange}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Popular Stocks */}
      <div style={{ marginTop: '2rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>Popular Stocks</h3>
        {loadingPop ? (
          <div className="spinner" />
        ) : (
          <div className="grid-2">
            {popular.map(s => (
              <div key={s.symbol} className="card stock-tile" onClick={() => navigate(`/stock/${s.symbol}`)}>
                <div className="stock-tile-top">
                  <div>
                    <strong>{s.symbol}</strong>
                    <p>{s.shortName}</p>
                  </div>
                  <div className={`change-badge ${s.change >= 0 ? 'positive' : 'negative'}`}>
                    {s.change >= 0 ? <FaArrowUp /> : <FaArrowDown />}
                    {Math.abs(s.changePct).toFixed(2)}%
                  </div>
                </div>
                <div className="stock-tile-price">
                  <span>${s.price?.toFixed(2)}</span>
                  <span className={s.change >= 0 ? 'positive' : 'negative'}>
                    {s.change >= 0 ? '+' : ''}{s.change?.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
