require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Rotas
const authRouter = require('./routes/auth');
const clientsRouter = require('./routes/clients');
const productsRouter = require('./routes/products');
const servicesRouter = require('./routes/services');
const serviceOrdersRouter = require('./routes/serviceOrders');
const financialRouter = require('./routes/financial');
const companyRouter = require('./routes/company');
const teamRouter = require('./routes/team');
const authMiddleware = require('./middleware/authMiddleware');

app.use('/api/auth', authRouter);

// Protected Routes
app.use('/api/clients', authMiddleware, clientsRouter);
app.use('/api/products', authMiddleware, productsRouter);
app.use('/api/services', authMiddleware, servicesRouter);
app.use('/api/service-orders', authMiddleware, serviceOrdersRouter);
app.use('/api/financial', authMiddleware, financialRouter);
app.use('/api/company', authMiddleware, companyRouter);
app.use('/api/team', authMiddleware, teamRouter);

const subscriptionRouter = require('./routes/subscription');
app.use('/api/subscription', subscriptionRouter);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
