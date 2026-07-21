import { Router } from 'express';
import prisma from '../prisma.js';

const router = Router();
const periods = ['DAILY', 'WEEKLY', 'MONTHLY'];

function goalData(body) {
  const amount = Number(body.amount), period = body.period?.toUpperCase();
  if (!body.name?.trim() || !Number.isFinite(amount) || amount <= 0 || !periods.includes(period)) return null;
  return { name: body.name.trim(), amount, period };
}

router.get('/', async (req, res, next) => {
  try { res.json(await prisma.financialGoal.findMany({ where: { userId: req.user.id }, orderBy: { createdAt: 'desc' } })); }
  catch (error) { next(error); }
});

router.post('/', async (req, res, next) => {
  try {
    const data = goalData(req.body);
    if (!data) return res.status(400).json({ message: 'Name, positive amount, and a valid period are required.' });
    res.status(201).json(await prisma.financialGoal.create({ data: { ...data, userId: req.user.id } }));
  } catch (error) { next(error); }
});

router.put('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id), data = goalData(req.body);
    if (!Number.isInteger(id) || !data) return res.status(400).json({ message: 'Please provide valid goal details.' });
    const existing = await prisma.financialGoal.findFirst({ where: { id, userId: req.user.id } });
    if (!existing) return res.status(404).json({ message: 'Goal not found.' });
    res.json(await prisma.financialGoal.update({ where: { id }, data }));
  } catch (error) { next(error); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ message: 'Invalid goal id.' });
    const existing = await prisma.financialGoal.findFirst({ where: { id, userId: req.user.id } });
    if (!existing) return res.status(404).json({ message: 'Goal not found.' });
    await prisma.financialGoal.delete({ where: { id } });
    res.status(204).end();
  } catch (error) { next(error); }
});

export default router;
