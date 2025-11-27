// TODO) Badge-Repository: 배지/소유 관계 저장소
import prisma from '../configs/prisma.js';

export const badgeRepo = {
  // 배지 정의
  createBadge(data) {
    return prisma.badge.create({ data });
  },
  findBadgeByKey(key) {
    return prisma.badge.findUnique({ where: { key } });
  },
  findBadgeById(id) {
    return prisma.badge.findUnique({ where: { id } });
  },
  listBadges() {
    return prisma.badge.findMany({ orderBy: { createdAt: 'asc' } });
  },

  // 유저 배지
  upsertUserBadge({ userId, badgeId, grantedAt, expiresAt, grantedBy, metadata }) {
    const payload = {
      userId,
      badgeId,
      grantedAt: grantedAt ?? new Date(),
      expiresAt: expiresAt ?? null,
      grantedBy: grantedBy ?? null,
      metadata: metadata ?? null,
    };

    return prisma.userBadge.upsert({
      where: { userId_badgeId: { userId, badgeId } },
      create: payload,
      update: payload,
      include: { badge: true },
    });
  },
  findUserBadge(userId, badgeId) {
    return prisma.userBadge.findUnique({
      where: { userId_badgeId: { userId, badgeId } },
      include: { badge: true },
    });
  },
  listUserBadges(userId) {
    return prisma.userBadge.findMany({
      where: { userId },
      include: { badge: true },
      orderBy: { grantedAt: 'desc' },
    });
  },
  expireUserBadge(userId, badgeId, expiresAt = new Date()) {
    return prisma.userBadge.update({
      where: { userId_badgeId: { userId, badgeId } },
      data: { expiresAt },
      include: { badge: true },
    });
  },

  // 그룹 배지
  upsertGroupBadge({ groupId, badgeId, grantedAt, expiresAt, grantedBy, metadata }) {
    const payload = {
      groupId,
      badgeId,
      grantedAt: grantedAt ?? new Date(),
      expiresAt: expiresAt ?? null,
      grantedBy: grantedBy ?? null,
      metadata: metadata ?? null,
    };

    return prisma.groupBadge.upsert({
      where: { groupId_badgeId: { groupId, badgeId } },
      create: payload,
      update: payload,
      include: { badge: true },
    });
  },
  findGroupBadge(groupId, badgeId) {
    return prisma.groupBadge.findUnique({
      where: { groupId_badgeId: { groupId, badgeId } },
      include: { badge: true },
    });
  },
  listGroupBadges(groupId) {
    return prisma.groupBadge.findMany({
      where: { groupId },
      include: { badge: true },
      orderBy: { grantedAt: 'desc' },
    });
  },
  expireGroupBadge(groupId, badgeId, expiresAt = new Date()) {
    return prisma.groupBadge.update({
      where: { groupId_badgeId: { groupId, badgeId } },
      data: { expiresAt },
      include: { badge: true },
    });
  },
};
