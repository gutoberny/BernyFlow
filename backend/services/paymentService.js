const { MercadoPagoConfig, Preference } = require('mercadopago');

// Configure Mercado Pago
// In production, these should be environment variables
const ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN;

const client = new MercadoPagoConfig({ accessToken: ACCESS_TOKEN });

const createPreference = async (companyId, userEmail) => {
    const preference = new Preference(client);

    try {
        const response = await preference.create({
            body: {
                // payer: {
                //     email: userEmail
                // },
                payment_methods: {
                    excluded_payment_methods: [],
                    excluded_payment_types: [],
                    installments: 12
                },
                items: [
                    {
                        title: 'BernyFlow Pro Plan',
                        unit_price: 197.00,
                        quantity: 1,
                        currency_id: 'BRL'
                    }
                ],
                external_reference: String(companyId),
                back_urls: {
                    success: `${process.env.FRONTEND_URL}/settings/company?status=success`,
                    failure: `${process.env.FRONTEND_URL}/settings/company?status=failure`,
                    pending: `${process.env.FRONTEND_URL}/settings/company?status=pending`
                },
                auto_return: 'approved',
                notification_url: process.env.WEBHOOK_URL
            }
        });
        console.log('Preference created:', response.id);
        return response.init_point;
    } catch (error) {
        console.error('Error creating preference:', error);
        throw error;
    }
};

module.exports = { createPreference, client };
