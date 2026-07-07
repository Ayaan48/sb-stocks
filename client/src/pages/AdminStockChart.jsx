import { useState } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { toast } from 'react-toastify';
import axiosInstance from '../components/axiosInstance';

const PERIODS = ['1d','1w','1mo','3mo','1y'];

const AdminStockChart = () => {
  const [symbol,  setSymbol]  = useState('');
  const [period,  setPeriod]  = useState('1mo');
  const [quote,   setQuote]   = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadStock = async () => {
    if (!symbol.trim()) return toast.error('Enter a stock symbol');
    setLoading(true);
    try {
      const [q, h] = await Promise.all([
        axiosInstance.get(`/stocks/${symbol.toUpperCase()}`),
        axiosInstance.get(`/stocks/${symbol.toUpperCase()}/history?period=${period}`),
      ]);
      setQuote(q.data);
      setHistory(h.data.map(d => ({
        date:  new Date(d.date).toLocaleDateString(),
        close: parseFloat(d.close?.toFixed(2)),
      })));
    } catch { toast.error('Stock not found'); }
    finally { setLoading(false); }
  };

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
      <div className="page-header"><h2>Stock Chart Analytics</h2></div>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '.8rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div className="form-group" style={{ margin: 0, flex: 1, minWidth: 180 }}>
            <label>Stock Symbol</label>
            <input
              value={symbol} onChange={e => setSymbol(e.target.value.toUpperCase())}
              placeholder="e.g. AAPL"
              onKeyDown={e => e.key === 'Enter' && loadStock()}
            />
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label>Period</label>
            <select value={period} onChange={e => setPeriod(e.target.value)}>
              {PERIODS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <button className="btn btn-primary" onClick={loadStock} disabled={loading}>
            {loading ? 'Loading…' : 'Load Chart'}
          </button>
        </div>
      </div>

      {quote && (
        <div className="card" style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3>{quote.symbol} — {quote.shortName}</h3>
              <p style={{ color: 'var(--text-muted)' }}>{quote.exchange}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>${quote.regularMarketPrice?.toFixed(2)}</div>
              <div className={quote.regularMarketChange >= 0 ? 'positive' : 'negative'} style={{ fontWeight: 600 }}>
                {quote.regularMarketChange >= 0 ? '+' : ''}{quote.regularMarketChange?.toFixed(2)}
                ({quote.regularMarketChangePercent?.toFixed(2)}%)
              </div>
            </div>
          </div>
        </div>
      )}

      {history.length > 0 && (
        <div className="card">
          <h3 style={{ marginBottom: '1rem' }}>{symbol} Price History — {period}</h3>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={history}>
              <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#0052cc" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#0052cc" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#dfe1e6" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} tickLine={false} />
              <YAxis domain={['auto','auto']} tick={{ fontSize: 11 }} tickLine={false} tickFormatter={v => '$' + v} />
              <Tooltip formatter={v => ['$' + v, 'Close']} />
              <Area type="monotone" dataKey="close" stroke="#0052cc" strokeWidth={2} fill="url(#grad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default AdminStockChart;
