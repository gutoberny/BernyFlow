const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Listar produtos
router.get('/', async (req, res) => {
    try {
        const products = await prisma.product.findMany({
            where: { companyId: req.user.companyId },
            orderBy: { name: 'asc' }
        });
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar produtos' });
    }
});

// Criar produto
router.post('/', async (req, res) => {
    try {
        const { name, description, price, stock, costPrice, freight, otherCosts, profitMargin } = req.body;
        const product = await prisma.product.create({
            data: {
                name,
                description,
                price: Number(price),
                stock: Number(stock),
                costPrice: Number(costPrice || 0),
                freight: Number(freight || 0),
                otherCosts: Number(otherCosts || 0),
                profitMargin: Number(profitMargin || 0),
                companyId: req.user.companyId
            }
        });
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar produto' });
    }
});

// Atualizar produto
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, stock, costPrice, freight, otherCosts, profitMargin } = req.body;

        // Verify ownership
        const existing = await prisma.product.findFirst({
            where: { id: Number(id), companyId: req.user.companyId }
        });

        if (!existing) return res.status(404).json({ error: 'Produto não encontrado' });

        const product = await prisma.product.update({
            where: { id: Number(id) },
            data: {
                name,
                description,
                price: Number(price),
                stock: Number(stock),
                costPrice: Number(costPrice || 0),
                freight: Number(freight || 0),
                otherCosts: Number(otherCosts || 0),
                profitMargin: Number(profitMargin || 0)
            }
        });
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar produto' });
    }
});

// Deletar produto
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Verify ownership
        const existing = await prisma.product.findFirst({
            where: { id: Number(id), companyId: req.user.companyId }
        });

        if (!existing) return res.status(404).json({ error: 'Produto não encontrado' });

        await prisma.product.delete({
            where: { id: Number(id) }
        });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar produto' });
    }
});

module.exports = router;
