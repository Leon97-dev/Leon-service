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

  listByGroupWithQuery(groupId, { search, orderBy = 'createdAt', order = 'desc', skip = 0, take = 50 } = {}) {
    const where = {
      groupId,
    };
    if (search) {
      where.OR = [
        { description: { contains: search, mode: 'insensitive' } },
        { exercise: { name: { contains: search, mode: 'insensitive' } } },
        { author: { nickname: { contains: search, mode: 'insensitive' } } },
      ];
    }

    return prisma.record.findMany({
      where,
      include: { exercise: true, author: true },
      orderBy: { [orderBy]: order },
      skip,
      take,
    });
  },

  countByGroup(groupId, { search } = {}) {
    const where = { groupId };
    if (search) {
      where.OR = [
        { description: { contains: search, mode: 'insensitive' } },
        { exercise: { name: { contains: search, mode: 'insensitive' } } },
        { author: { nickname: { contains: search, mode: 'insensitive' } } },
      ];
    }
    return prisma.record.count({ where });
  },

  aggregateByGroup(groupId, startDate, endDate) {
    return prisma.record.groupBy({
      by: ['authorId'],
      where: {
        groupId,
        authorId: { not: null },
        createdAt: {
          gte: startDate,
          lt: endDate,
        },
      },
      _sum: {
        distance: true,
        time: true,
        count: true,
      },
      _count: true,
      orderBy: [
        { _sum: { distance: 'desc' } },
        { _sum: { count: 'desc' } },
        { _sum: { time: 'desc' } },
      ],
      take: 10,
    });
  },
};
