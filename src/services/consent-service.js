// TODO) Consent-Service: 동의 비즈니스 로직
import {
  ConflictError,
  NotFoundError,
} from '../core/error/error-handler.js';
import { policyRepo } from '../repo/policy-repository.js';
import { consentRepo } from '../repo/consent-repository.js';

export const consentService = {
  // 정책 정의
  async createPolicy(data) {
    const exists = await policyRepo.findPolicyByKeyVersion(data.key, data.version);
    if (exists) throw new ConflictError('이미 존재하는 정책 버전입니다');
    return policyRepo.createPolicy(data);
  },

  listPolicies() {
    return policyRepo.listPolicies();
  },

  // 동의/철회
  async recordConsent(userId, { policyId, accepted }) {
    const policy = await policyRepo.findPolicyById(policyId);
    if (!policy) throw new NotFoundError('정책을 찾을 수 없습니다');

    const now = new Date();
    await consentRepo.expireActive(userId, policyId, now);

    const withdrawnAt = accepted === false ? now : null;

    return consentRepo.create(userId, policyId, {
      accepted: accepted !== false,
      versionSnapshot: policy.version,
      acceptedAt: now,
      withdrawnAt,
      effectiveFrom: now,
      effectiveTo: null,
    });
  },

  async listUserConsents(userId) {
    const items = await consentRepo.listByUser(userId);

    // 최신 상태만 정리해서 반환 (policyId별 첫 항목)
    const latest = [];
    const seen = new Set();
    for (const item of items) {
      if (seen.has(item.policyId)) continue;
      latest.push(item);
      seen.add(item.policyId);
    }
    return { latest, history: items };
  },
};
