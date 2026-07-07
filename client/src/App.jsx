import { Routes, Route, Navigate } from 'react-router-dom';
import { useGeneral } from './context/GeneralContext';
import Navbar from './components/Navbar';
import Landing       from './pages/Landing';
import Login         from './components/Login';
import Register      from './components/Register';
import Home          from './pages/Home';
import Portfolio     from './pages/Portfolio';
import StockChart    from './pages/StockChart';
import History       from './pages/History';
import AllTransactions from './pages/AllTransactions';
import Profile       from './pages/Profile';
import Admin         from './pages/Admin';
import AdminStockChart from './pages/AdminStockChart';
import AllOrders             from './pages/AllOrders';
import AdminAllTransactions  from './pages/AdminAllTransactions';
import Users                 from './pages/Users';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useGeneral();
  if (loading) return <div className="spinner" style={{ marginTop: '5rem' }} />;
  return user ? children : <Navigate to="/login" replace />;
};

const AdminRoute = ({ children }) => {
  const { user, loading } = useGeneral();
  if (loading) return <div className="spinner" style={{ marginTop: '5rem' }} />;
  if (!user) return <Navigate to="/login" replace />;
  return user.role === 'admin' ? children : <Navigate to="/home" replace />;
};

const App = () => {
  const { user } = useGeneral();

  return (
    <>
      <Navbar />
      <Routes>
        {/* Public */}
        <Route path="/" element={user ? <Navigate to="/home" /> : <Landing />} />
        <Route path="/login"    element={user ? <Navigate to="/home" /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/home" /> : <Register />} />

        {/* Protected user routes */}
        <Route path="/home"      element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path="/portfolio" element={<PrivateRoute><Portfolio /></PrivateRoute>} />
        <Route path="/history"   element={<PrivateRoute><History /></PrivateRoute>} />
        <Route path="/transactions" element={<PrivateRoute><AllTransactions /></PrivateRoute>} />
        <Route path="/profile"   element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/stock/:symbol" element={<PrivateRoute><StockChart /></PrivateRoute>} />

        {/* Admin routes */}
        <Route path="/admin"              element={<AdminRoute><Admin /></AdminRoute>} />
        <Route path="/admin/chart"        element={<AdminRoute><AdminStockChart /></AdminRoute>} />
        <Route path="/admin/orders"       element={<AdminRoute><AllOrders /></AdminRoute>} />
        <Route path="/admin/transactions" element={<AdminRoute><AdminAllTransactions /></AdminRoute>} />
        <Route path="/admin/users"        element={<AdminRoute><Users /></AdminRoute>} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

export default App;
