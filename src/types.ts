import { Request } from 'express';
import { User } from '@prisma/client';
import { JsonValue } from '@prisma/client/runtime/library';

export interface AuthenticatedRequest extends Request {
  user?: User;
}

export interface TargetingRule {
  condition: string;
  enabled: boolean;
}

export interface FeatureFlag {
  id: string;
  name: string;
  enabled: boolean;
  targeting: Targeting | JsonValue;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Targeting {
  default: boolean;
  rules: TargetingRule[];
}
