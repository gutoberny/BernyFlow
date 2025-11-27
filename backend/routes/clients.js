const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Listar todos os clientes da empresa
router.get('/', async (req, res) => {
    try {
        const clients = await prisma.client.findMany({
            where: { companyId: req.user.companyId },
            orderBy: { name: 'asc' }
        });
        res.json(clients);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar clientes' });
    }
});

// Criar novo cliente
router.post('/', async (req, res) => {
    try {
        const { name, email, phone, address } = req.body;
        const client = await prisma.client.create({
            data: { 
                name, 
                email, 
                phone, 
                address,
                companyId: req.user.companyId
            }
        });
        res.status(201).json(client);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar cliente' });
    }
});

// Atualizar cliente
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, phone, address } = req.body;
        
        // Verify ownership
        const existing = await prisma.client.findFirst({
            where: { id: Number(id), companyId: req.user.companyId }
        });

        if (!existing) return res.status(404).json({ error: 'Cliente não encontrado' });

        const client = await prisma.client.update({
            where: { id: Number(id) },
            data: { name, email, phone, address }
        });
        res.json(client);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar cliente' });
    }
});

// Deletar cliente
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Verify ownership
        const existing = await prisma.client.findFirst({
            where: { id: Number(id), companyId: req.user.companyId }
        });

        if (!existing) return res.status(404).json({ error: 'Cliente não encontrado' });

        await prisma.client.delete({
            where: { id: Number(id) }
        });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar cliente' });
    }
});

module.exports = router;
