const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Listar OS
router.get('/', async (req, res) => {
    try {
        const orders = await prisma.serviceOrder.findMany({
            include: {
                client: true,
                items: {
                    include: {
                        product: true,
                        service: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar ordens de serviço' });
    }
});

// Obter OS por ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const order = await prisma.serviceOrder.findUnique({
            where: { id: Number(id) },
            include: {
                client: true,
                items: {
                    include: {
                        product: true,
                        service: true
                    }
                },
                transactions: true
            }
        });
        if (!order) return res.status(404).json({ error: 'OS não encontrada' });
        res.json(order);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar OS' });
    }
});

// Criar OS
router.post('/', async (req, res) => {
    try {
        const { clientId, description, displacementCost } = req.body;
        const order = await prisma.serviceOrder.create({
            data: {
                clientId: Number(clientId),
                description,
                displacementCost: Number(displacementCost || 0),
                status: 'OPEN'
            }
        });
        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar OS' });
    }
});

// Atualizar OS (Status, Custos, Descrição, Faturamento)
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { status, description, displacementCost, endDate, paymentMethod, paymentType } = req.body;

        const currentOrder = await prisma.serviceOrder.findUnique({
            where: { id: Number(id) },
            include: { transactions: true }
        });

        if (!currentOrder) return res.status(404).json({ error: 'OS não encontrada' });

        // Lógica de Reabertura (Reopen)
        if (status === 'OPEN' && currentOrder.status !== 'OPEN') {
            const transaction = await prisma.financialTransaction.findFirst({
                where: { serviceOrderId: Number(id) }
            });

            if (transaction) {
                // Se existir transação (Paga ou Pendente), exclui ao reabrir
                await prisma.financialTransaction.delete({
                    where: { id: transaction.id }
                });
            }
        }

        const data = {};
        if (status) data.status = status;
        if (description !== undefined) data.description = description;
        if (displacementCost !== undefined) data.displacementCost = Number(displacementCost);
        if (endDate) data.endDate = new Date(endDate);
        if (paymentMethod) data.paymentMethod = paymentMethod;
        if (paymentType) data.paymentType = paymentType;

        // Se reabrindo, limpa dados de pagamento e data fim
        if (status === 'OPEN') {
            data.paymentMethod = null;
            data.paymentType = null;
            data.endDate = null;
        }

        const order = await prisma.serviceOrder.update({
            where: { id: Number(id) },
            data
        });

        // Se mudou para COMPLETED, gerar transação financeira
        if (status === 'COMPLETED' && currentOrder.status !== 'COMPLETED') {
            // Calcular total
            const items = await prisma.serviceOrderItem.findMany({ where: { serviceOrderId: Number(id) } });
            const totalItems = items.reduce((acc, item) => acc + item.totalPrice, 0);
            const total = totalItems + order.displacementCost;

            // Verificar se já existe transação para evitar duplicidade
            const existingTx = await prisma.financialTransaction.findFirst({ where: { serviceOrderId: Number(id) } });

            if (!existingTx) {
                let txDescription = `Receita OS #${order.id}`;
                if (paymentMethod) txDescription += ` - ${paymentMethod}`;
                if (paymentType) txDescription += ` (${paymentType})`;

                const isInstallment = paymentType === 'INSTALLMENT';
                const txStatus = isInstallment ? 'PENDING' : 'PAID';
                const txDueDate = isInstallment && req.body.dueDate ? new Date(req.body.dueDate) : new Date();
                const txPaidAt = isInstallment ? null : new Date();

                await prisma.financialTransaction.create({
                    data: {
                        description: txDescription,
                        amount: total,
                        type: 'INCOME',
                        serviceOrderId: order.id,
                        status: txStatus,
                        dueDate: txDueDate,
                        paidAt: txPaidAt
                    }
                });
            }
        }

        res.json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao atualizar OS' });
    }
});

// Adicionar Item à OS
router.post('/:id/items', async (req, res) => {
    try {
        const { id } = req.params;
        const { productId, serviceId, quantity, unitPrice, isFirstHour } = req.body;

        const qty = Number(quantity);
        const price = Number(unitPrice);
        const total = qty * price;

        const item = await prisma.serviceOrderItem.create({
            data: {
                serviceOrderId: Number(id),
                productId: productId ? Number(productId) : null,
                serviceId: serviceId ? Number(serviceId) : null,
                quantity: qty,
                unitPrice: price,
                totalPrice: total,
                isFirstHour: Boolean(isFirstHour)
            }
        });

        // Se for produto, abater estoque
        if (productId) {
            await prisma.product.update({
                where: { id: Number(productId) },
                data: { stock: { decrement: qty } }
            });
        }

        res.status(201).json(item);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao adicionar item' });
    }
});

// Remover Item da OS
router.delete('/items/:itemId', async (req, res) => {
    try {
        const { itemId } = req.params;
        const item = await prisma.serviceOrderItem.findUnique({ where: { id: Number(itemId) } });

        if (item && item.productId) {
            // Devolver ao estoque
            await prisma.product.update({
                where: { id: item.productId },
                data: { stock: { increment: item.quantity } }
            });
        }

        await prisma.serviceOrderItem.delete({
            where: { id: Number(itemId) }
        });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Erro ao remover item' });
    }
});

module.exports = router;
