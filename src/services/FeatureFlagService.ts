import { PrismaClient } from '@prisma/client';
import { FeatureFlag, Targeting } from '../types';
import { featureFlagSchema } from '../validators/featureFlagValidator';

const prisma = new PrismaClient();

class FeatureFlagService {
  async getAllFlags(userId: string): Promise<FeatureFlag[]> {
    // TODO: Ensure `targeting` has the correct structure
    return await prisma.featureFlag.findMany({ where: { userId } });
  }

  async getFlagById(
    userId: string,
    flagId: string,
  ): Promise<FeatureFlag | null> {
    return await prisma.featureFlag.findFirst({
      where: { id: flagId, userId },
    });
  }

  async createFlag(userId: string, data: any): Promise<FeatureFlag> {
    // Validate input before creating flag
    const validatedData = featureFlagSchema.parse(data);

    const flag = await prisma.featureFlag.create({
      data: {
        name: validatedData.name,
        enabled: validatedData.enabled,
        targeting: JSON.stringify(validatedData.targeting),
        userId,
      },
    });

    // Ensure `targeting` has the correct structure
    return {
      ...flag,
      targeting: JSON.parse(flag.targeting as unknown as string) as Targeting,
    };
  }

  async updateFlag(flagId: string, userId: string, data: any) {
    try {
      const validatedData = featureFlagSchema.partial().parse(data);

      // ✅ Fix: Use only `id` in `where` (since it's unique)
      return await prisma.featureFlag.update({
        where: { id: flagId },
        data: validatedData,
      });
    } catch (error) {
      console.error(`🚨 Error updating flag ${flagId}:`, error);
      return null;
    }
  }

  async deleteFlag(flagId: string, userId: string) {
    try {
      // ✅ Fetch the flag first to verify ownership
      const flag = await prisma.featureFlag.findUnique({
        where: { id: flagId },
      });

      if (!flag) {
        console.log('🚨 Flag not found:', flagId);
        return false;
      }

      if (flag.userId !== userId) {
        console.log('🚨 Unauthorized delete attempt:', userId);
        return false;
      }

      await prisma.featureFlag.delete({ where: { id: flagId } });
      return true;
    } catch (error) {
      console.error('🚨 Prisma Delete Error:', error);
      return false;
    }
  }

  async evaluateFlag(
    userId: string,
    flagId: string,
    userContext: any,
  ): Promise<boolean> {
    const flag = await prisma.featureFlag.findFirst({
      where: { id: flagId, userId },
    });

    if (!flag) throw new Error('Flag not found');

    const { targeting } = flag as any; // Ensure correct type
    const parsedTargeting = JSON.parse(
      targeting as unknown as string,
    ) as Targeting;
    let isEnabled = parsedTargeting.default;

    for (const rule of parsedTargeting.rules) {
      try {
        const conditionFunction = new Function(
          'user',
          `return ${rule.condition};`,
        );
        if (conditionFunction(userContext)) {
          isEnabled = rule.enabled;
          break;
        }
      } catch (err) {
        console.error('Invalid condition:', rule.condition);
      }
    }

    return isEnabled;
  }
}

export default new FeatureFlagService();
