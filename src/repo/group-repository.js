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
  listGroups() {
    return prisma.group.findMany({
      orderBy: { createdAt: 'desc' },
    });
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
};
