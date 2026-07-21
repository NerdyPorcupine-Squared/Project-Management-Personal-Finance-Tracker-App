import 'dotenv/config';
import { startServer } from './app.js';

if (!process.env.JWT_SECRET) console.warn('Warning: JWT_SECRET is not set. Add it to server/.env before starting the app.');

startServer();
