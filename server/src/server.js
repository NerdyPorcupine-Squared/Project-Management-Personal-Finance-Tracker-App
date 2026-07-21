import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import transactionRoutes from './routes/transactions.js';
import goalRoutes from './routes/goals.js';
import { requireAuth } from './middleware/auth.js';

if (!process.env.JWT_SECRET) console.warn('Warning: JWT_SECRET is not set. Add it to server/.env before starting the app.');

const app = express();
app.use(cors());
app.use(express.json());
app.get('/api/health', (req, res) => res.json({ message: 'Finance Tracker API is running.' }));
app.use('/api/auth', authRoutes);
app.use('/api/transactions', requireAuth, transactionRoutes);
app.use('/api/goals', requireAuth, goalRoutes);
app.use((err, req, res, next) => { console.error(err); res.status(500).json({ message: 'Something went wrong. Please try again.' }); });

app.listen(process.env.PORT || 5000, () => console.log(`Server running on port ${process.env.PORT || 5000}`));
