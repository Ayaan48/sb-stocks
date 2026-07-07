import { useState, useEffect } from 'react';
import axiosInstance from '../components/axiosInstance';

const AllOrders = () => {
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance.get('/orders/all')
      .then(r => setOrders(r.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="spinner" style={{ marginTop: '4rem' }} />;

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
      <div className="page-header">
        <h2>All Orders</h2>
        <span style={{ color: 'var(--text-muted)', fontSize: '.9rem' }}>{orders.length} total</span>
      </div>
      {orders.length === 0 ? (
        <div className="empty-state card"><h3>No orders yet</h3></div>
      ) : (
        <div className="card">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>User</th>
                <th>Symbol</th>
                <th>Type</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o._id}>
                  <td>{new Date(o.createdAt).toLocaleString()}</td>
                  <td>{o.userId?.username || '—'}</td>
                  <td><strong style={{ color: 'var(--primary)' }}>{o.symbol}</strong></td>
                  <td><span className={`badge badge-${o.type}`}>{o.type.toUpperCase()}</span></td>
                  <td>{o.quantity}</td>
                  <td>${o.price.toFixed(2)}</td>
                  <td>${o.totalAmount.toFixed(2)}</td>
                  <td><span className="badge badge-buy">{o.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AllOrders;
