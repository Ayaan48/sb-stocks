import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../components/axiosInstance';
import { useGeneral } from '../context/GeneralContext';

const Portfolio = () => {
  const { user }        = useGeneral();
  const navigate        = useNavigate();
  const [portfolio, setPortfolio] = useState([]);
  const [prices, setPrices]       = useState({});
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    axiosInstance.get('/orders/portfolio').then(async ({ data }) => {
      setPortfolio(data);
      // Fetch current prices for each holding
      const priceMap = {};
      await Promise.all(data.map(async (item) => {
        try {
          const r = await axiosInstance.get(`/stocks/${item.symbol}`);
          priceMap[item.symbol] = r.data.regularMarketPrice;
        } catch { priceMap[item.symbol] = null; }
      }));
      setPrices(priceMap);
    }).finally(() => setLoading(false));
  }, []);

  const totalInvested  = portfolio.reduce((s, p) => s + p.totalInvested, 0);
  const totalCurrentVal = portfolio.reduce((s, p) => {
    const cur = prices[p.symbol];
    return s + (cur ? cur * p.quantity : p.totalInvested);
  }, 0);
  const totalPL = totalCurrentVal - totalInvested;

  if (loading) return <div className="spinner" style={{ marginTop: '4rem' }} />;

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
      <div className="page-header">
        <h2>My Portfolio</h2>
      </div>

      {/* Summary cards */}
      <div className="grid-3" style={{ marginBottom: '1.5rem' }}>
        <div className="card">
          <label>Total Invested</label>
          <strong style={{ fontSize: '1.4rem' }}>${totalInvested.toFixed(2)}</strong>
        </div>
        <div className="card">
          <label>Current Value</label>
          <strong style={{ fontSize: '1.4rem' }}>${totalCurrentVal.toFixed(2)}</strong>
        </div>
        <div className="card">
          <label>Unrealized P&L</label>
          <strong style={{ fontSize: '1.4rem' }} className={totalPL >= 0 ? 'positive' : 'negative'}>
            {totalPL >= 0 ? '+' : ''}${totalPL.toFixed(2)}
          </strong>
        </div>
      </div>

      {portfolio.length === 0 ? (
        <div className="empty-state card">
          <h3>No holdings yet</h3>
          <p>Search for stocks and make your first trade!</p>
          <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={() => navigate('/home')}>
            Browse Stocks
          </button>
        </div>
      ) : (
        <div className="card">
          <table>
            <thead>
              <tr>
                <th>Symbol</th>
                <th>Name</th>
                <th>Qty</th>
                <th>Avg Price</th>
                <th>Cur Price</th>
                <th>Invested</th>
                <th>Cur Value</th>
                <th>P&L</th>
              </tr>
            </thead>
            <tbody>
              {portfolio.map(p => {
                const curPrice = prices[p.symbol];
                const curVal   = curPrice ? curPrice * p.quantity : null;
                const pl       = curVal !== null ? curVal - p.totalInvested : null;
                return (
                  <tr key={p.symbol} style={{ cursor: 'pointer' }} onClick={() => navigate(`/stock/${p.symbol}`)}>
                    <td><strong style={{ color: 'var(--primary)' }}>{p.symbol}</strong></td>
                    <td>{p.stockName || '—'}</td>
                    <td>{p.quantity}</td>
                    <td>${p.averagePrice.toFixed(2)}</td>
                    <td>{curPrice ? '$' + curPrice.toFixed(2) : '—'}</td>
                    <td>${p.totalInvested.toFixed(2)}</td>
                    <td>{curVal !== null ? '$' + curVal.toFixed(2) : '—'}</td>
                    <td className={pl !== null ? (pl >= 0 ? 'positive' : 'negative') : ''}>
                      {pl !== null ? (pl >= 0 ? '+' : '') + '$' + pl.toFixed(2) : '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Portfolio;
