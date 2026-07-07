require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const connectDB = require('./config/db');

const userRoute        = require('./routes/userRoute');
const stockRoute       = require('./routes/stockRoute');
const orderRoute       = require('./routes/orderRoute');
const transactionRoute = require('./routes/transactionRoute');

connectDB();

const app  = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    cb(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));
app.use(express.json());

app.use('/api/users',        userRoute);
app.use('/api/stocks',       stockRoute);
app.use('/api/orders',       orderRoute);
app.use('/api/transactions', transactionRoute);

app.get('/', (req, res) => res.json({ message: 'SB Stocks API running' }));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
