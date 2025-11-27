const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const authMiddleware = require('../middleware/authMiddleware');
const { createPreference, client } = require('../services/paymentService');
const { Payment } = require('mercadopago');

// Create Checkout Preference
router.post('/checkout', authMiddleware, async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id }
        });

        const initPoint = await createPreference(req.user.companyId, user.email);
        res.json({ initPoint });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creating checkout' });
    }
});

// Webhook to receive payment notifications
router.post('/webhook', async (req, res) => {
    try {
        const { type, data } = req.body;

        if (type === 'payment') {
            const payment = new Payment(client);
            const paymentInfo = await payment.get({ id: data.id });

            if (paymentInfo.status === 'approved') {
                const companyId = Number(paymentInfo.external_reference);

                // Upgrade company to PRO
                await prisma.company.update({
                    where: { id: companyId },
                    data: { plan: 'PRO' }
                });

                console.log(`Company ${companyId} upgraded to PRO`);
            }
        }

        res.status(200).send();
    } catch (error) {
        console.error('Webhook error:', error);
        res.status(500).send();
    }
});

module.exports = router;
