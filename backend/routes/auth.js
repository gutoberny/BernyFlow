const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/authMiddleware');

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // In production, use env var

// Register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, companyName } = req.body;

        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Transaction to create Company and User
        const result = await prisma.$transaction(async (prisma) => {
            // Create Company
            const company = await prisma.company.create({
                data: {
                    name: companyName || `${name}'s Company`
                }
            });

            // Create User linked to Company with OWNER role
            const user = await prisma.user.create({
                data: {
                    name,
                    email,
                    password: hashedPassword,
                    role: 'OWNER',
                    companyId: company.id
                }
            });

            return { user, company };
        });

        const { user, company } = result;

        // Create token
        const token = jwt.sign({ 
            id: user.id, 
            companyId: company.id,
            role: user.role 
        }, JWT_SECRET, { expiresIn: '1d' });

        res.status(201).json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                companyId: user.companyId
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error registering user' });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check user
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Create token
        const token = jwt.sign({ 
            id: user.id, 
            companyId: user.companyId,
            role: user.role 
        }, JWT_SECRET, { expiresIn: '1d' });

        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                companyId: user.companyId
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error logging in' });
    }
});

// Get current user
router.get('/me', authMiddleware, async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                companyId: true
            }
        });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching user' });
    }
});

// Update profile
router.put('/profile', authMiddleware, async (req, res) => {
    try {
        const { name, email } = req.body;
        const user = await prisma.user.update({
            where: { id: req.user.id },
            data: { name, email },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                companyId: true
            }
        });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Error updating profile' });
    }
});

// Change password
router.put('/change-password', authMiddleware, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        
        const user = await prisma.user.findUnique({
            where: { id: req.user.id }
        });

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Senha atual incorreta' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await prisma.user.update({
            where: { id: req.user.id },
            data: { password: hashedPassword }
        });

        res.json({ message: 'Senha alterada com sucesso' });
    } catch (error) {
        res.status(500).json({ error: 'Error changing password' });
    }
});

module.exports = router;
