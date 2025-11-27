// TODO) UserConsent-Repository: 동의 이력 저장소
import prisma from '../configs/prisma.js';

export const consentRepo = {
  expireActive(userId, policyId, effectiveTo) {
    return prisma.userConsent.updateMany({
      where: { userId, policyId, effectiveTo: null },
      data: { effectiveTo },
    });
  },

  create(userId, policyId, payload) {
    return prisma.userConsent.create({
      data: {
        userId,
        policyId,
        ...payload,
      },
    });
  },

  listByUser(userId) {
    return prisma.userConsent.findMany({
      where: { userId },
      include: { policy: true },
      orderBy: { effectiveFrom: 'desc' },
    });
  },

  latest(userId, policyId) {
    return prisma.userConsent.findFirst({
      where: { userId, policyId },
      include: { policy: true },
      orderBy: { effectiveFrom: 'desc' },
    });
  },
};
