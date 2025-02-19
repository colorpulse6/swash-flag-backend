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
exports.authenticate = void 0;
const client_1 = require("@prisma/client");
const featureFlagValidator_1 = require("../validators/featureFlagValidator");
const prisma = new client_1.PrismaClient();
const authenticate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const apiKey = req.headers['x-api-key'];
        featureFlagValidator_1.apiKeySchema.parse({ apiKey });
        if (!apiKey) {
            res.status(401).json({ error: 'API key required' });
            return;
        }
        const user = yield prisma.user.findUnique({ where: { apiKey } });
        featureFlagValidator_1.userSchema.parse(user);
        if (!user) {
            res.status(403).json({ error: 'Invalid API key' });
            return;
        }
        req.user = user; // ✅ Attach user to request
        next(); // ✅ Proceed to the next middleware
    }
    catch (error) {
        console.error('Authentication error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.authenticate = authenticate;
