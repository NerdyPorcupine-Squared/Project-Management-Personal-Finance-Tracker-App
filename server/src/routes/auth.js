import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../prisma.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
const createToken = (user) => jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });

router.post('/register', async (req, res, next) => {
  try {
    const email = req.body.email?.trim().toLowerCase();
    const { password } = req.body;
    if (!email || !password || password.length < 6) return res.status(400).json({ message: 'Enter a valid email and a password with at least 6 characters.' });
    if (await prisma.user.findUnique({ where: { email } })) return res.status(409).json({ message: 'An account with that email already exists.' });
    const user = await prisma.user.create({ data: { email, password: await bcrypt.hash(password, 10) } });
    res.status(201).json({ token: createToken(user), user: { id: user.id, email: user.email } });
  } catch (error) { next(error); }
});

router.post('/login', async (req, res, next) => {
  try {
    const email = req.body.email?.trim().toLowerCase();
    const user = email && await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(req.body.password || '', user.password))) return res.status(401).json({ message: 'Email or password is incorrect.' });
    res.json({ token: createToken(user), user: { id: user.id, email: user.email } });
  } catch (error) { next(error); }
});

router.get('/me', requireAuth, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id }, select: { id: true, email: true, createdAt: true } });
    res.json(user);
  } catch (error) { next(error); }
});

export default router;
