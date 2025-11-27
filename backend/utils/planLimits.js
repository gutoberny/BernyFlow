const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const PLAN_LIMITS = {
    FREE: {
        clients: 10,
        orders: 10,
        users: 1
    },
    PRO: {
        clients: Infinity,
        orders: Infinity,
        users: Infinity
    }
};

/**
 * Check if a company has reached the limit for a specific resource.
 * @param {number} companyId 
 * @param {'clients' | 'orders' | 'users'} resourceType 
 * @returns {Promise<{allowed: boolean, message?: string}>}
 */
const checkLimit = async (companyId, resourceType) => {
    const company = await prisma.company.findUnique({
        where: { id: companyId },
        select: { plan: true }
    });

    if (!company) throw new Error('Company not found');

    const plan = company.plan || 'FREE';
    const limit = PLAN_LIMITS[plan][resourceType];

    if (limit === Infinity) return { allowed: true };

    let currentCount = 0;

    switch (resourceType) {
        case 'clients':
            currentCount = await prisma.client.count({ where: { companyId } });
            break;
        case 'orders':
            currentCount = await prisma.serviceOrder.count({ where: { companyId } });
            break;
        case 'users':
            currentCount = await prisma.user.count({ where: { companyId } });
            break;
    }

    if (currentCount >= limit) {
        return {
            allowed: false,
            message: `Limite do plano ${plan} atingido. Faça upgrade para continuar.`
        };
    }

    return { allowed: true };
};

module.exports = { PLAN_LIMITS, checkLimit };
