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
const clientsRouter = require('./routes/clients');
const productsRouter = require('./routes/products');
const servicesRouter = require('./routes/services');
const serviceOrdersRouter = require('./routes/serviceOrders');
const financialRouter = require('./routes/financial');

app.use('/api/clients', clientsRouter);
app.use('/api/products', productsRouter);
app.use('/api/services', servicesRouter);
app.use('/api/service-orders', serviceOrdersRouter);
app.use('/api/financial', financialRouter);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
