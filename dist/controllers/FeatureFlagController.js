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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const featureFlagValidator_1 = require("../validators/featureFlagValidator");
const FeatureFlagService_1 = __importDefault(require("../services/FeatureFlagService"));
class FeatureFlagController {
    getFlags(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!userId) {
                    res.status(404).json({ error: 'User not found' });
                    return;
                }
                const flags = yield FeatureFlagService_1.default.getAllFlags(userId);
                res.json(flags);
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to fetch flags' });
            }
        });
    }
    getFlagById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!userId) {
                    res.status(404).json({ error: 'User not found' });
                    return;
                }
                const flag = yield FeatureFlagService_1.default.getFlagById(userId, req.params.id);
                if (!flag) {
                    res.status(404).json({ error: 'Feature flag not found' });
                    return;
                }
                res.json(flag);
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to fetch feature flag' });
            }
        });
    }
    createFlag(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!userId) {
                    res.status(404).json({ error: 'User not found' });
                    return;
                }
                const validatedData = featureFlagValidator_1.featureFlagSchema.parse(req.body);
                const flag = yield FeatureFlagService_1.default.createFlag(userId, validatedData);
                res.status(201).json(flag);
            }
            catch (error) {
                res.status(400).json({
                    error: error instanceof Error ? error.message : 'Invalid data',
                });
            }
        });
    }
    updateFlag(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!userId) {
                    res.status(404).json({ error: 'User not found' });
                    return;
                }
                const updatedFlag = yield FeatureFlagService_1.default.updateFlag(userId, req.params.id, req.body);
                if (!updatedFlag) {
                    res.status(404).json({ error: 'Feature flag not found' });
                    return;
                }
                res.json(updatedFlag);
            }
            catch (error) {
                res.status(400).json({
                    error: error instanceof Error ? error.message : 'Invalid update data',
                });
            }
        });
    }
    deleteFlag(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!userId) {
                    res.status(404).json({ error: 'User not found' });
                    return;
                }
                yield FeatureFlagService_1.default.deleteFlag(userId, req.params.id);
                res.status(204).send();
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to delete feature flag' });
            }
        });
    }
    evaluateFlag(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!userId) {
                    res.status(404).json({ error: 'User not found' });
                    return;
                }
                const isEnabled = yield FeatureFlagService_1.default.evaluateFlag(userId, req.params.id, req.body.user);
                res.json({ enabled: isEnabled });
            }
            catch (error) {
                res.status(500).json({ error: 'Evaluation failed' });
            }
        });
    }
}
exports.default = new FeatureFlagController();
