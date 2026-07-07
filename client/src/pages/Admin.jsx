import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaUsers, FaExchangeAlt, FaShoppingCart, FaChartBar } from 'react-icons/fa';
import axiosInstance from '../components/axiosInstance';
import './Admin.css';

const Admin = () => {
  const [stats, setStats]   = useState({ users: 0, orders: 0, transactions: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      axiosInstance.get('/users/all'),
      axiosInstance.get('/orders/all'),
      axiosInstance.get('/transactions/all'),
    ]).then(([u, o, t]) => {
      setStats({ users: u.data.length, orders: o.data.length, transactions: t.data.length });
    }).finally(() => setLoading(false));
  }, []);

  const cards = [
    { icon: <FaUsers />,       label: 'Total Users',        value: stats.users,        to: '/admin/users',        color: '#0052cc' },
    { icon: <FaShoppingCart />,label: 'Total Orders',       value: stats.orders,       to: '/admin/orders',       color: '#00875a' },
    { icon: <FaExchangeAlt />, label: 'Total Transactions', value: stats.transactions, to: '/admin/transactions', color: '#6554c0' },
    { icon: <FaChartBar />,    label: 'Stock Analytics',    value: '→',               to: '/admin/chart',        color: '#de350b' },
  ];

  return (
    <div className="container admin-page" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
      <div className="page-header">
        <h2>Admin Dashboard</h2>
        <span style={{ color: 'var(--text-muted)', fontSize: '.9rem' }}>SB Stocks Management</span>
      </div>

      {loading ? <div className="spinner" /> : (
        <div className="grid-4">
          {cards.map(c => (
            <Link key={c.label} to={c.to} className="admin-stat-card card">
              <div className="admin-stat-icon" style={{ color: c.color, background: c.color + '18' }}>
                {c.icon}
              </div>
              <div className="admin-stat-value">{c.value}</div>
              <div className="admin-stat-label">{c.label}</div>
            </Link>
          ))}
        </div>
      )}

      <div className="admin-links" style={{ marginTop: '2rem' }}>
        <div className="card">
          <h3>Quick Navigation</h3>
          <div style={{ display: 'flex', gap: '.8rem', flexWrap: 'wrap', marginTop: '1rem' }}>
            <Link to="/admin/users"        className="btn btn-outline">Manage Users</Link>
            <Link to="/admin/orders"       className="btn btn-outline">All Orders</Link>
            <Link to="/admin/transactions" className="btn btn-outline">All Transactions</Link>
            <Link to="/admin/chart"        className="btn btn-outline">Stock Charts</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
