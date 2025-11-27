// TODO) Policy-Repository: 동의 정책 저장소
import prisma from '../configs/prisma.js';

export const policyRepo = {
  createPolicy(data) {
    return prisma.policy.create({ data });
  },
  findPolicyById(id) {
    return prisma.policy.findUnique({ where: { id } });
  },
  findPolicyByKeyVersion(key, version) {
    return prisma.policy.findFirst({ where: { key, version } });
  },
  listPolicies() {
    return prisma.policy.findMany({ orderBy: [{ key: 'asc' }, { version: 'desc' }] });
  },
};
