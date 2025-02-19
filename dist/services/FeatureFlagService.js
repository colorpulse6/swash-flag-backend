"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const featureFlagValidator_1 = require("../validators/featureFlagValidator");
const prisma = new client_1.PrismaClient();
class FeatureFlagService {
    getAllFlags(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: Ensure `targeting` has the correct structure
            return yield prisma.featureFlag.findMany({ where: { userId } });
        });
    }
    getFlagById(userId, flagId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma.featureFlag.findFirst({
                where: { id: flagId, userId },
            });
        });
    }
    createFlag(userId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            // Validate input before creating flag
            const validatedData = featureFlagValidator_1.featureFlagSchema.parse(data);
            const flag = yield prisma.featureFlag.create({
                data: {
                    name: validatedData.name,
                    enabled: validatedData.enabled,
                    targeting: JSON.stringify(validatedData.targeting),
                    userId,
                },
            });
            // Ensure `targeting` has the correct structure
            return Object.assign(Object.assign({}, flag), { targeting: JSON.parse(flag.targeting) });
        });
    }
    updateFlag(userId, flagId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const validatedData = featureFlagValidator_1.featureFlagSchema.partial().parse(data); // Allow partial updates
            return yield prisma.featureFlag.update({
                where: { id: flagId, userId },
                data: validatedData,
            });
        });
    }
    deleteFlag(userId, flagId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield prisma.featureFlag.delete({
                where: { id: flagId, userId },
            });
        });
    }
    evaluateFlag(userId, flagId, userContext) {
        return __awaiter(this, void 0, void 0, function* () {
            const flag = yield prisma.featureFlag.findFirst({
                where: { id: flagId, userId },
            });
            if (!flag)
                throw new Error('Flag not found');
            const { targeting } = flag; // Ensure correct type
            const parsedTargeting = JSON.parse(targeting);
            let isEnabled = parsedTargeting.default;
            for (const rule of parsedTargeting.rules) {
                try {
                    const conditionFunction = new Function('user', `return ${rule.condition};`);
                    if (conditionFunction(userContext)) {
                        isEnabled = rule.enabled;
                        break;
                    }
                }
                catch (err) {
                    console.error('Invalid condition:', rule.condition);
                }
            }
            return isEnabled;
        });
    }
}
exports.default = new FeatureFlagService();
