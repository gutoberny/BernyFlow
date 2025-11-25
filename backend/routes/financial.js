const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Listar transações
router.get('/', async (req, res) => {
    try {
        const { type, status, startDate, endDate } = req.query;
        const where = {};

        if (type) where.type = type;
        if (status) where.status = status;

        if (startDate || endDate) {
            where.date = {};
            if (startDate) where.date.gte = new Date(startDate);
            if (endDate) where.date.lte = new Date(endDate);
        }

        const transactions = await prisma.financialTransaction.findMany({
            where,
            orderBy: { date: 'desc' },
            include: { serviceOrder: { include: { client: true } } }
        });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar transações' });
    }
});

// Criar transação manual
router.post('/', async (req, res) => {
    try {
        const { description, amount, type, status, dueDate, date, recurrence, installments } = req.body;

        if (recurrence && installments > 1) {
            const transactions = [];
            const baseDate = new Date(date || new Date());
            const baseDueDate = dueDate ? new Date(dueDate) : null;

            for (let i = 0; i < installments; i++) {
                const currentDescription = `${description} (${i + 1}/${installments})`;

                // Calcular datas para este mês
                const currentDate = new Date(baseDate);
                currentDate.setMonth(currentDate.getMonth() + i);

                let currentDueDate = null;
                if (baseDueDate) {
                    currentDueDate = new Date(baseDueDate);
                    currentDueDate.setMonth(currentDueDate.getMonth() + i);
                }

                transactions.push({
                    description: currentDescription,
                    amount: Number(amount),
                    type,
                    status,
                    date: currentDate,
                    dueDate: currentDueDate,
                    paidAt: status === 'PAID' ? new Date() : null
                });
            }

            await prisma.financialTransaction.createMany({
                data: transactions
            });

            res.status(201).json({ message: 'Transações recorrentes criadas com sucesso' });
        } else {
            // Criação simples (sem recorrência)
            const transaction = await prisma.financialTransaction.create({
                data: {
                    description,
                    amount: Number(amount),
                    type,
                    status,
                    date: date ? new Date(date) : new Date(),
                    dueDate: dueDate ? new Date(dueDate) : null,
                    paidAt: status === 'PAID' ? new Date() : null
                }
            });
            res.status(201).json(transaction);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao criar transação' });
    }
});

// Atualizar transação
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { description, amount, type, status, dueDate, date } = req.body;

        const transaction = await prisma.financialTransaction.findUnique({
            where: { id: Number(id) }
        });

        if (!transaction) {
            return res.status(404).json({ error: 'Transação não encontrada' });
        }

        const data = {};

        // Se tem OS vinculada, só permite alterar status
        if (transaction.serviceOrderId) {
            if (status) {
                data.status = status;
                if (status === 'PAID' && transaction.status !== 'PAID') {
                    data.paidAt = new Date();
                } else if (status === 'PENDING') {
                    data.paidAt = null;
                }
            }
        } else {
            // Se é manual, permite alterar tudo
            if (description) data.description = description;
            if (amount) data.amount = Number(amount);
            if (type) data.type = type;
            if (date) data.date = new Date(date);
            if (dueDate) data.dueDate = new Date(dueDate);

            if (status) {
                data.status = status;
                if (status === 'PAID' && transaction.status !== 'PAID') {
                    data.paidAt = new Date();
                } else if (status === 'PENDING') {
                    data.paidAt = null;
                }
            }
        }

        const updatedTransaction = await prisma.financialTransaction.update({
            where: { id: Number(id) },
            data
        });
        res.json(updatedTransaction);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao atualizar transação' });
    }
});

// Excluir transação
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const transaction = await prisma.financialTransaction.findUnique({
            where: { id: Number(id) }
        });

        if (!transaction) {
            return res.status(404).json({ error: 'Transação não encontrada' });
        }

        if (transaction.serviceOrderId) {
            return res.status(403).json({ error: 'Não é possível excluir uma transação vinculada a uma OS' });
        }

        await prisma.financialTransaction.delete({
            where: { id: Number(id) }
        });

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Erro ao excluir transação' });
    }
});

// Obter resumo financeiro
router.get('/summary', async (req, res) => {
    try {
        const income = await prisma.financialTransaction.aggregate({
            where: { type: 'INCOME', status: 'PAID' },
            _sum: { amount: true }
        });

        const expense = await prisma.financialTransaction.aggregate({
            where: { type: 'EXPENSE', status: 'PAID' },
            _sum: { amount: true }
        });

        const pendingIncome = await prisma.financialTransaction.aggregate({
            where: { type: 'INCOME', status: 'PENDING' },
            _sum: { amount: true }
        });

        const pendingExpense = await prisma.financialTransaction.aggregate({
            where: { type: 'EXPENSE', status: 'PENDING' },
            _sum: { amount: true }
        });

        res.json({
            income: income._sum.amount || 0,
            expense: expense._sum.amount || 0,
            pendingIncome: pendingIncome._sum.amount || 0,
            pendingExpense: pendingExpense._sum.amount || 0,
            balance: (income._sum.amount || 0) - (expense._sum.amount || 0)
        });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar resumo' });
    }
});

module.exports = router;
