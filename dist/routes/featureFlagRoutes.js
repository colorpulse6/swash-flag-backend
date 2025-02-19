"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authenticate_1 = require("@middleware/authenticate");
const FeatureFlagController_1 = __importDefault(require("../controllers/FeatureFlagController"));
const router = express_1.default.Router();
router.get('/flags', authenticate_1.authenticate, FeatureFlagController_1.default.getFlags);
router.get('/flags/:id', authenticate_1.authenticate, FeatureFlagController_1.default.getFlagById);
router.post('/flags', authenticate_1.authenticate, FeatureFlagController_1.default.createFlag);
router.put('/flags/:id', authenticate_1.authenticate, FeatureFlagController_1.default.updateFlag);
router.delete('/flags/:id', authenticate_1.authenticate, FeatureFlagController_1.default.deleteFlag);
router.post('/flags/:id/evaluate', authenticate_1.authenticate, FeatureFlagController_1.default.evaluateFlag);
exports.default = router;
