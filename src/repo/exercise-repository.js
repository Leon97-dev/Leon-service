// TODO) Exercise-Repository: 운동 종목 사전 저장소
import prisma from '../configs/prisma.js';

export const exerciseRepo = {
  createExercise(data) {
    return prisma.exercise.create({ data });
  },
  findByKey(key) {
    return prisma.exercise.findUnique({ where: { key } });
  },
  findById(id) {
    return prisma.exercise.findUnique({ where: { id } });
  },
  listAll() {
    return prisma.exercise.findMany({ orderBy: { name: 'asc' } });
  },
};
