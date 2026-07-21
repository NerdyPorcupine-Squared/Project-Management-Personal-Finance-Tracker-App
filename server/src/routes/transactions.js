import { Router } from 'express';
import prisma from '../prisma.js';

const router = Router();
const transactionTypes = ['INCOME', 'EXPENSE'];

function transactionData(body) {
  const amount = Number(body.amount);
  const type = body.type?.toUpperCase();
  if (!Number.isFinite(amount) || amount <= 0 || !transactionTypes.includes(type) || !body.category?.trim() || !body.date) return null;
  const date = new Date(body.date);
  if (Number.isNaN(date.getTime())) return null;
  return { amount, type, category: body.category.trim(), description: body.description?.trim() || null, date };
}

router.get('/', async (req, res, next) => {
  try { res.json(await prisma.transaction.findMany({ where: { userId: req.user.id }, orderBy: { date: 'desc' } })); }
  catch (error) { next(error); }
});

router.post('/', async (req, res, next) => {
  try {
    const data = transactionData(req.body);
    if (!data) return res.status(400).json({ message: 'Amount, type, category, and a valid date are required.' });
    res.status(201).json(await prisma.transaction.create({ data: { ...data, userId: req.user.id } }));
  } catch (error) { next(error); }
});

router.put('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id), data = transactionData(req.body);
    if (!Number.isInteger(id) || !data) return res.status(400).json({ message: 'Please provide valid transaction details.' });
    const existing = await prisma.transaction.findFirst({ where: { id, userId: req.user.id } });
    if (!existing) return res.status(404).json({ message: 'Transaction not found.' });
    res.json(await prisma.transaction.update({ where: { id }, data }));
  } catch (error) { next(error); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const existing = await prisma.transaction.findFirst({ where: { id, userId: req.user.id } });
    if (!existing) return res.status(404).json({ message: 'Transaction not found.' });
    await prisma.transaction.delete({ where: { id } });
    res.status(204).end();
  } catch (error) { next(error); }
});

export default router;
