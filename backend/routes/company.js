const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const authMiddleware = require('../middleware/authMiddleware');
const checkRole = require('../middleware/roleMiddleware');

const prisma = new PrismaClient();

// Get company details
router.get('/', authMiddleware, async (req, res) => {
    try {
        const company = await prisma.company.findUnique({
            where: { id: req.user.companyId }
        });

        if (!company) {
            return res.status(404).json({ error: 'Company not found' });
        }

        res.json(company);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching company details' });
    }
});

// Update company details
router.put('/', authMiddleware, checkRole(['OWNER', 'ADMIN']), async (req, res) => {
    try {
        const { name, cnpj, address, phone, email } = req.body;

        const company = await prisma.company.update({
            where: { id: req.user.companyId },
            data: {
                name,
                cnpj,
                address,
                phone,
                email
            }
        });

        res.json(company);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating company details' });
    }
});

module.exports = router;
