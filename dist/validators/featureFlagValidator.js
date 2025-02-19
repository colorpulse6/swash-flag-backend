"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiKeySchema = exports.userSchema = exports.featureFlagSchema = exports.targetingSchema = exports.targetingRuleSchema = void 0;
const zod_1 = require("zod");
// Define the schema for targeting rules
exports.targetingRuleSchema = zod_1.z.object({
    condition: zod_1.z.string(),
    enabled: zod_1.z.boolean(),
});
// Define the schema for the targeting object
exports.targetingSchema = zod_1.z.object({
    default: zod_1.z.boolean(),
    rules: zod_1.z.array(exports.targetingRuleSchema),
});
// Define the schema for feature flag creation
exports.featureFlagSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Feature flag name is required'),
    enabled: zod_1.z.boolean(),
    targeting: exports.targetingSchema,
});
exports.userSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6, 'Password must be at least 6 characters long'),
});
exports.apiKeySchema = zod_1.z.object({
    apiKey: zod_1.z.string().uuid(),
});
