const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Listar produtos
router.get('/', async (req, res) => {
    try {
        const products = await prisma.product.findMany({
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
                profitMargin: Number(profitMargin || 0)
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
        await prisma.product.delete({
            where: { id: Number(id) }
        });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar produto' });
    }
});

module.exports = router;
