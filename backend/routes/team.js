const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const authMiddleware = require('../middleware/authMiddleware');
const checkRole = require('../middleware/roleMiddleware');

const prisma = new PrismaClient();

// List all users in the company
router.get('/', authMiddleware, async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            where: {
                companyId: req.user.companyId
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true
            }
        });
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching team members' });
    }
});

const { checkLimit } = require('../utils/planLimits');

// Invite a new user
router.post('/invite', authMiddleware, checkRole(['OWNER', 'ADMIN']), async (req, res) => {
    try {
        // Check Plan Limits
        const limitCheck = await checkLimit(req.user.companyId, 'users');
        if (!limitCheck.allowed) {
            return res.status(403).json({ error: limitCheck.message });
        }

        const { name, email, role } = req.body;

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Generate a temporary password (for MVP)
        // In a real app, we would send an email with an invite link
        const tempPassword = Math.random().toString(36).slice(-8);
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(tempPassword, salt);

        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: role || 'USER',
                companyId: req.user.companyId
            }
        });

        res.status(201).json({
            message: 'User invited successfully',
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            },
            tempPassword // Return this so the admin can give it to the user
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error inviting user' });
    }
});

module.exports = router;
