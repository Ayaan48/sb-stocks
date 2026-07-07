import { useState } from 'react';
import { toast } from 'react-toastify';
import { FaWallet, FaUser } from 'react-icons/fa';
import axiosInstance from '../components/axiosInstance';
import { useGeneral } from '../context/GeneralContext';

const Profile = () => {
  const { user, refreshUser } = useGeneral();
  const [amount,   setAmount]   = useState('');
  const [loading,  setLoading]  = useState(false);

  const handleFunds = async (type) => {
    const val = parseFloat(amount);
    if (!val || val <= 0) return toast.error('Enter a valid amount');
    setLoading(true);
    try {
      const { data } = await axiosInstance.put(`/users/${type}`, { amount: val });
      toast.success(data.message);
      setAmount('');
      await refreshUser();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Transaction failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem', maxWidth: 700 }}>
      <div className="page-header"><h2>My Profile</h2></div>

      <div className="card" style={{ marginBottom: '1.2rem' }}>
        <h3 style={{ marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '.5rem' }}>
          <FaUser /> Account Details
        </h3>
        <div className="grid-2">
          <div>
            <label>Username</label>
            <p style={{ fontWeight: 700, fontSize: '1rem' }}>{user?.username}</p>
          </div>
          <div>
            <label>Email</label>
            <p style={{ fontWeight: 700, fontSize: '1rem' }}>{user?.email}</p>
          </div>
          <div>
            <label>Role</label>
            <p style={{ fontWeight: 700, textTransform: 'capitalize' }}>{user?.role}</p>
          </div>
          <div>
            <label>Member since</label>
            <p style={{ fontWeight: 700 }}>{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}</p>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '.5rem' }}>
          <FaWallet /> Virtual Funds
        </h3>
        <div className="balance-display">
          <label>Current Balance</label>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--success)' }}>
            ${user?.balance?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
        </div>
        <div className="form-group" style={{ marginTop: '1.5rem' }}>
          <label>Amount ($)</label>
          <input
            type="number" min="1" value={amount}
            onChange={e => setAmount(e.target.value)}
            placeholder="Enter amount e.g. 1000"
          />
        </div>
        <div style={{ display: 'flex', gap: '.8rem' }}>
          <button className="btn btn-success" onClick={() => handleFunds('deposit')} disabled={loading}>
            Deposit Funds
          </button>
          <button className="btn btn-danger" onClick={() => handleFunds('withdraw')} disabled={loading}>
            Withdraw Funds
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
