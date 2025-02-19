import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
// Middleware to validate targeting before writing to the database
prisma.$use(async (params, next) => {
    if (params.model === 'FeatureFlag' &&
        (params.action === 'create' || params.action === 'update')) {
        const targeting = params.args.data.targeting;
        if (!targeting.default || !Array.isArray(targeting.rules)) {
            throw new Error('Invalid targeting format');
        }
    }
    return next(params);
});
export default prisma;
