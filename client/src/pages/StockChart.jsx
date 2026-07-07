import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { FaArrowLeft, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import axiosInstance from '../components/axiosInstance';
import { useGeneral } from '../context/GeneralContext';
import './StockChart.css';

const PERIODS = ['1d','1w','1mo','3mo','1y'];

const StockChart = () => {
  const { symbol }        = useParams();
  const navigate          = useNavigate();
  const { user, refreshUser } = useGeneral();

  const [quote,   setQuote]   = useState(null);
  const [history, setHistory] = useState([]);
  const [period,  setPeriod]  = useState('1mo');
  const [loading, setLoading] = useState(true);
  const [tradeType, setTradeType] = useState('buy');
  const [qty,    setQty]    = useState(1);
  const [trading, setTrading] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      axiosInstance.get(`/stocks/${symbol}`),
      axiosInstance.get(`/stocks/${symbol}/history?period=${period}`),
    ]).then(([q, h]) => {
      setQuote(q.data);
      setHistory(h.data.map(d => ({
        date:  new Date(d.date).toLocaleDateString(),
        close: parseFloat(d.close?.toFixed(2)),
      })));
    }).catch(() => toast.error('Failed to load stock data'))
      .finally(() => setLoading(false));
  }, [symbol, period]);

  const fetchHistory = async (p) => {
    setPeriod(p);
    try {
      const { data } = await axiosInstance.get(`/stocks/${symbol}/history?period=${p}`);
      setHistory(data.map(d => ({
        date:  new Date(d.date).toLocaleDateString(),
        close: parseFloat(d.close?.toFixed(2)),
      })));
    } catch { toast.error('Failed to load history'); }
  };

  const handleTrade = async () => {
    if (qty < 1) return toast.error('Quantity must be at least 1');
    setTrading(true);
    try {
      const price = quote.regularMarketPrice;
      const { data } = await axiosInstance.post(`/orders/${tradeType}`, {
        symbol, stockName: quote.shortName, quantity: Number(qty), price,
      });
      toast.success(`${tradeType === 'buy' ? 'Bought' : 'Sold'} ${qty} share(s) of ${symbol} at $${price.toFixed(2)}`);
      await refreshUser();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Trade failed');
    } finally {
      setTrading(false);
    }
  };

  if (loading) return <div className="spinner" style={{ marginTop: '4rem' }} />;
  if (!quote)  return <div className="container" style={{ paddingTop: '2rem' }}>Stock not found.</div>;

  const isPositive = quote.regularMarketChange >= 0;
  const price = quote.regularMarketPrice;
  const total = (qty * price).toFixed(2);

  return (
    <div className="stock-page container" style={{ paddingTop: '1.5rem', paddingBottom: '3rem' }}>
      <button className="btn btn-outline btn-sm back-btn" onClick={() => navigate(-1)}>
        <FaArrowLeft /> Back
      </button>

      <div className="stock-header card">
        <div className="stock-info">
          <div>
            <h2>{symbol}</h2>
            <p>{quote.shortName}</p>
            <span className="exch-tag">{quote.exchange} · {quote.currency}</span>
          </div>
          <div className="price-block">
            <div className="main-price">${price?.toFixed(2)}</div>
            <div className={`price-change ${isPositive ? 'positive' : 'negative'}`}>
              {isPositive ? <FaArrowUp /> : <FaArrowDown />}
              {isPositive ? '+' : ''}{quote.regularMarketChange?.toFixed(2)}
              &nbsp;({isPositive ? '+' : ''}{quote.regularMarketChangePercent?.toFixed(2)}%)
            </div>
          </div>
        </div>

        <div className="stock-meta grid-4">
          <div><label>Open</label>  <strong>${quote.regularMarketOpen?.toFixed(2)}</strong></div>
          <div><label>High</label>  <strong>${quote.regularMarketDayHigh?.toFixed(2)}</strong></div>
          <div><label>Low</label>   <strong>${quote.regularMarketDayLow?.toFixed(2)}</strong></div>
          <div><label>Prev Close</label><strong>${quote.regularMarketPreviousClose?.toFixed(2)}</strong></div>
          <div><label>52W High</label><strong>${quote.fiftyTwoWeekHigh?.toFixed(2)}</strong></div>
          <div><label>52W Low</label> <strong>${quote.fiftyTwoWeekLow?.toFixed(2)}</strong></div>
          <div><label>Volume</label>  <strong>{quote.regularMarketVolume?.toLocaleString()}</strong></div>
          <div><label>Mkt Cap</label> <strong>{quote.marketCap ? '$' + (quote.marketCap / 1e9).toFixed(2) + 'B' : '—'}</strong></div>
        </div>
      </div>

      <div className="stock-body">
        {/* Chart */}
        <div className="card chart-card">
          <div className="period-tabs">
            {PERIODS.map(p => (
              <button key={p} className={`period-tab ${period === p ? 'active' : ''}`} onClick={() => fetchHistory(p)}>
                {p}
              </button>
            ))}
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={history}>
              <defs>
                <linearGradient id="colorClose" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={isPositive ? '#00875a' : '#de350b'} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={isPositive ? '#00875a' : '#de350b'} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#dfe1e6" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} tickLine={false} />
              <YAxis domain={['auto','auto']} tick={{ fontSize: 11 }} tickLine={false} tickFormatter={v => '$' + v} />
              <Tooltip formatter={(v) => ['$' + v, 'Close']} />
              <Area
                type="monotone" dataKey="close"
                stroke={isPositive ? '#00875a' : '#de350b'}
                strokeWidth={2} fill="url(#colorClose)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Trade Panel */}
        <div className="card trade-panel">
          <h3>Place Order</h3>
          <p className="balance-info">Balance: <strong>${user?.balance?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong></p>

          <div className="trade-tabs">
            <button className={`trade-tab ${tradeType === 'buy'  ? 'active-buy'  : ''}`} onClick={() => setTradeType('buy')}>Buy</button>
            <button className={`trade-tab ${tradeType === 'sell' ? 'active-sell' : ''}`} onClick={() => setTradeType('sell')}>Sell</button>
          </div>

          <div className="form-group">
            <label>Current Price</label>
            <input value={`$${price?.toFixed(2)}`} readOnly />
          </div>
          <div className="form-group">
            <label>Quantity</label>
            <input type="number" min="1" value={qty} onChange={e => setQty(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Estimated Total</label>
            <input value={`$${total}`} readOnly />
          </div>

          <button
            className={`btn ${tradeType === 'buy' ? 'btn-success' : 'btn-danger'}`}
            style={{ width: '100%' }}
            onClick={handleTrade}
            disabled={trading}
          >
            {trading ? 'Processing…' : `${tradeType === 'buy' ? 'Buy' : 'Sell'} ${qty} Share${qty > 1 ? 's' : ''}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StockChart;
