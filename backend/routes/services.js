const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Listar serviços
router.get('/', async (req, res) => {
    try {
        const services = await prisma.service.findMany({
            orderBy: { name: 'asc' }
        });
        res.json(services);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar serviços' });
    }
});

// Criar serviço
router.post('/', async (req, res) => {
    try {
        const { name, description, price } = req.body;
        const service = await prisma.service.create({
            data: {
                name,
                description,
                price: Number(price)
            }
        });
        res.status(201).json(service);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar serviço' });
    }
});

// Atualizar serviço
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price } = req.body;
        const service = await prisma.service.update({
            where: { id: Number(id) },
            data: {
                name,
                description,
                price: Number(price)
            }
        });
        res.json(service);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar serviço' });
    }
});

// Deletar serviço
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.service.delete({
            where: { id: Number(id) }
        });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar serviço' });
    }
});

module.exports = router;
