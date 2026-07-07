import { useState, useEffect } from 'react';
import axiosInstance from '../components/axiosInstance';

const AdminAllTransactions = () => {
  const [txns,   setTxns]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance.get('/transactions/all')
      .then(r => setTxns(r.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="spinner" style={{ marginTop: '4rem' }} />;

  const typeColor = { deposit: 'badge-buy', withdrawal: 'badge-sell', buy: 'badge-buy', sell: 'badge-sell' };

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
      <div className="page-header">
        <h2>All Transactions</h2>
        <span style={{ color: 'var(--text-muted)', fontSize: '.9rem' }}>{txns.length} total</span>
      </div>
      {txns.length === 0 ? (
        <div className="empty-state card"><h3>No transactions yet</h3></div>
      ) : (
        <div className="card">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>User</th>
                <th>Type</th>
                <th>Description</th>
                <th>Symbol</th>
                <th>Qty</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {txns.map(t => (
                <tr key={t._id}>
                  <td>{new Date(t.createdAt).toLocaleString()}</td>
                  <td>{t.userId?.username || '—'}</td>
                  <td><span className={`badge ${typeColor[t.type] || 'badge-buy'}`}>{t.type.toUpperCase()}</span></td>
                  <td>{t.description || '—'}</td>
                  <td>{t.symbol || '—'}</td>
                  <td>{t.quantity || '—'}</td>
                  <td><strong>${t.amount.toFixed(2)}</strong></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminAllTransactions;
