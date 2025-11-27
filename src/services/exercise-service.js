// TODO) Exercise-Service: 운동 종목 사전 비즈니스 로직
import { ConflictError, NotFoundError } from '../core/error/error-handler.js';
import { exerciseRepo } from '../repo/exercise-repository.js';

export const exerciseService = {
  async createExercise(data) {
    const exists = await exerciseRepo.findByKey(data.key);
    if (exists) throw new ConflictError('이미 존재하는 운동 key입니다');
    return exerciseRepo.createExercise(data);
  },

  listExercises() {
    return exerciseRepo.listAll();
  },

  async getExercise(id) {
    const exercise = await exerciseRepo.findById(id);
    if (!exercise) throw new NotFoundError('운동 종목을 찾을 수 없습니다');
    return exercise;
  },
};
