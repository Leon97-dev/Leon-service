// TODO) Group-Repository: 그룹/참여자 저장소
import prisma from '../configs/prisma.js';

const clientOrDefault = (tx) => tx || prisma;

export const groupRepo = {
  // 그룹
  createGroup(data, tx = null) {
    const db = clientOrDefault(tx);
    return db.group.create({ data });
  },
  updateGroup(id, data, tx = null) {
    const db = clientOrDefault(tx);
    return db.group.update({ where: { id }, data });
  },
  deleteGroup(id, tx = null) {
    const db = clientOrDefault(tx);
    return db.group.delete({ where: { id } });
  },
  findGroupById(id) {
    return prisma.group.findUnique({ where: { id } });
  },
  findGroupWithParticipants(id) {
    return prisma.group.findUnique({
      where: { id },
      include: {
        participants: true,
        groupBadges: { include: { badge: true } },
      },
    });
  },
  listGroups({ search, orderBy = 'createdAt', order = 'desc', skip = 0, take = 50 } = {}) {
    const where = search
      ? {
          name: {
            contains: search,
            mode: 'insensitive',
          },
        }
      : undefined;

    return prisma.group.findMany({
      where,
      orderBy: { [orderBy]: order },
      skip,
      take,
      include: {
        participants: true,
        owner: true,
      },
    });
  },

  countGroups({ search } = {}) {
    const where = search
      ? {
          name: { contains: search, mode: 'insensitive' },
        }
      : undefined;
    return prisma.group.count({ where });
  },

  // 참여자
  createParticipant(data, tx = null) {
    const db = clientOrDefault(tx);
    return db.participant.create({ data });
  },
  findParticipantByUser(groupId, userId) {
    return prisma.participant.findFirst({ where: { groupId, userId } });
  },
  findParticipantById(id) {
    return prisma.participant.findUnique({ where: { id } });
  },
  listParticipants(groupId) {
    return prisma.participant.findMany({ where: { groupId } });
  },
  deleteParticipant(id, tx = null) {
    const db = clientOrDefault(tx);
    return db.participant.delete({ where: { id } });
  },

  updateParticipant(id, data, tx = null) {
    const db = clientOrDefault(tx);
    return db.participant.update({ where: { id }, data });
  },

  // 좋아요
  findLikeByUser(groupId, userId) {
    return prisma.groupLike.findUnique({
      where: {
        groupId_userId: { groupId, userId },
      },
    });
  },

  createLike(groupId, userId, tx = null) {
    const db = clientOrDefault(tx);
    return db.groupLike.create({
      data: { groupId, userId },
    });
  },

  deleteLike(groupId, userId, tx = null) {
    const db = clientOrDefault(tx);
    return db.groupLike.delete({
      where: {
        groupId_userId: { groupId, userId },
      },
    });
  },

  incrementLikeCount(groupId, tx = null) {
    const db = clientOrDefault(tx);
    return db.group.update({
      where: { id: groupId },
      data: { likeCount: { increment: 1 } },
    });
  },

  decrementLikeCount(groupId, tx = null) {
    const db = clientOrDefault(tx);
    return db.group.update({
      where: { id: groupId },
      data: { likeCount: { decrement: 1 } },
    });
  },

  countLikes(groupId) {
    return prisma.groupLike.count({ where: { groupId } });
  },
};
