"use strict";
// import { NextFunction, Request, Response } from 'express';
// import * as dotenv from 'dotenv';
// import { PrismaClient } from '@prisma/client';
// import { AuthenticatedRequest, FeatureFlag } from './types';
//
// import express = require('express');
// import cors = require('cors');
// import {
//   apiKeySchema,
//   featureFlagSchema,
//   targetingSchema,
//   userSchema,
// } from './validators/featureFlagValidator';
//
// dotenv.config();
// const app = express();
// const prisma = new PrismaClient();
//
// app.use(cors());
// app.use(express.json());
//
// // Error handling middleware
// app.use((err: any, req: Request, res: Response, next: NextFunction) => {
//   console.error('Error:', err);
//   res
//     .status(500)
//     .json({ error: 'Internal Server Error', details: err.message });
// });
//
// export const authenticate = async (
//   req: AuthenticatedRequest,
//   res: Response,
//   next: NextFunction,
// ): Promise<void> => {
//   try {
//     const apiKey = req.headers['x-api-key'] as string;
//
//     // Validate API key
//     apiKeySchema.parse({ apiKey });
//
//     if (!apiKey) {
//       res.status(401).json({ error: 'API key required' });
//       return;
//     }
//
//     const user = await prisma.user.findUnique({ where: { apiKey } });
//
//     if (!user) {
//       res.status(403).json({ error: 'Invalid API key' });
//       return;
//     }
//
//     // Validate user data
//     userSchema.parse(user);
//
//     req.user = user; // Attach user to request
//     next(); // Call next() to continue the request
//   } catch (error) {
//     console.error('Authentication error:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };
//
// // Get all feature flags
// app.get(
//   '/flags',
//   authenticate,
//   async (req: AuthenticatedRequest, res: Response) => {
//     try {
//       const flags = await prisma.featureFlag.findMany({
//         where: { userId: req.user.id },
//       });
//       res.json(flags);
//     } catch (error) {
//       res.status(500).json({ error: 'Failed to fetch flags' });
//     }
//   },
// );
//
// // Create a new feature flag
// app.post(
//   '/flags',
//   authenticate,
//   async (req: AuthenticatedRequest, res: Response) => {
//     try {
//       const { name, enabled, targeting } = req.body;
//
//       // Validate targeting
//       const parsedTargeting = targetingSchema.parse(targeting);
//
//       const flag = await prisma.featureFlag.create({
//         data: {
//           name,
//           enabled,
//           targeting: parsedTargeting,
//           userId: req.user.id,
//         },
//       });
//
//       res.status(201).json(flag);
//     } catch (error) {
//       res.status(400).json({
//         error: error instanceof Error ? error.message : 'Invalid data',
//       });
//     }
//   },
// );
//
// // Get a feature flag
// app.get('/flags/:id', async (req, res, next) => {
//   try {
//     const flag = await prisma.featureFlag.findUnique({
//       where: { id: req.params.id },
//     });
//     flag ? res.json(flag) : res.status(404).json({ error: 'Flag not found' });
//   } catch (error) {
//     next(error);
//   }
// });
//
// // Update a feature flag
// app.put('/flags/:id', async (req, res, next) => {
//   try {
//     const validatedData = featureFlagSchema.partial().parse(req.body);
//     const flag = await prisma.featureFlag.update({
//       where: { id: req.params.id },
//       data: validatedData,
//     });
//     res.json(flag);
//   } catch (error) {
//     next(error);
//   }
// });
//
// // Delete a feature flag
// app.delete('/flags/:id', async (req, res, next) => {
//   try {
//     await prisma.featureFlag.delete({ where: { id: req.params.id } });
//     res.status(204).send();
//   } catch (error) {
//     next(error);
//   }
// });
//
// // Evaluate a feature flag for a user
//
// // @ts-ignore
// app.post(
//   '/flags/:id/evaluate',
//   authenticate,
//   //@ts-ignore
//   async (req: AuthenticatedRequest, res: Response) => {
//     try {
//       const flag = await prisma.featureFlag.findFirst({
//         where: { id: req.params.id, userId: req.user.id },
//       });
//
//       if (!flag) return res.status(404).json({ error: 'Flag not found' });
//
//       const { targeting } = flag as unknown as FeatureFlag;
//       let isEnabled = targeting.default;
//
//       for (const rule of targeting.rules) {
//         try {
//           const conditionFunction = new Function(
//             'user',
//             `return ${rule.condition};`,
//           );
//           if (conditionFunction(req.body.user)) {
//             isEnabled = rule.enabled;
//             break;
//           }
//         } catch (err) {
//           console.error('Invalid condition:', rule.condition);
//         }
//       }
//
//       res.json({ enabled: isEnabled });
//     } catch (error) {
//       res.status(500).json({ error: 'Evaluation failed' });
//     }
//   },
// );
//
// // Start server
// const PORT = process.env.PORT || 4000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const PORT = process.env.PORT || 4000;
app_1.default.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
