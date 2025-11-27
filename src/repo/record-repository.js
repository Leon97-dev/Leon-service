// TODO) Record-Repository: 운동 기록 저장소
import prisma from '../configs/prisma.js';

export const recordRepo = {
  createRecord(data) {
    return prisma.record.create({ data });
  },
  findById(id) {
    return prisma.record.findUnique({
      where: { id },
      include: { exercise: true, author: true, group: true },
    });
  },
  listByGroup(groupId) {
    return prisma.record.findMany({
      where: { groupId },
      include: { exercise: true, author: true },
      orderBy: { createdAt: 'desc' },
    });
  },
  updateRecord(id, data) {
    return prisma.record.update({ where: { id }, data });
  },
  deleteRecord(id) {
    return prisma.record.delete({ where: { id } });
  },
};
