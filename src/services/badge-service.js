// TODO) Badge-Service: 배지 비즈니스 로직
import {
  ConflictError,
  NotFoundError,
} from '../core/error/error-handler.js';
import { badgeRepo } from '../repo/badge-repository.js';

export const badgeService = {
  // 배지 정의 생성
  async createBadge(data) {
    const exists = await badgeRepo.findBadgeByKey(data.key);
    if (exists) {
      throw new ConflictError('이미 존재하는 배지 key입니다');
    }
    return badgeRepo.createBadge(data);
  },

  listBadges() {
    return badgeRepo.listBadges();
  },

  // 유저 배지
  async grantUserBadge(payload) {
    const badge = await badgeRepo.findBadgeById(payload.badgeId);
    if (!badge) throw new NotFoundError('배지를 찾을 수 없습니다');
    return badgeRepo.upsertUserBadge(payload);
  },

  async revokeUserBadge(userId, badgeId) {
    const existing = await badgeRepo.findUserBadge(userId, badgeId);
    if (!existing) throw new NotFoundError('보유한 배지를 찾을 수 없습니다');
    return badgeRepo.expireUserBadge(userId, badgeId, new Date());
  },

  listUserBadges(userId) {
    return badgeRepo.listUserBadges(userId);
  },

  // 그룹 배지
  async grantGroupBadge(payload) {
    const badge = await badgeRepo.findBadgeById(payload.badgeId);
    if (!badge) throw new NotFoundError('배지를 찾을 수 없습니다');
    return badgeRepo.upsertGroupBadge(payload);
  },

  async revokeGroupBadge(groupId, badgeId) {
    const existing = await badgeRepo.findGroupBadge(groupId, badgeId);
    if (!existing) throw new NotFoundError('보유한 배지를 찾을 수 없습니다');
    return badgeRepo.expireGroupBadge(groupId, badgeId, new Date());
  },

  listGroupBadges(groupId) {
    return badgeRepo.listGroupBadges(groupId);
  },
};
