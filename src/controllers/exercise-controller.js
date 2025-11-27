// TODO) Exercise-Controller: 운동 종목 요청 처리
import { exerciseService } from '../services/exercise-service.js';

export const exerciseController = {
  async createExercise(req, res) {
    const { key, name, category, defaultUnit } = req.body;
    if (!key || !name) {
      return res.status(400).json({
        success: false,
        message: 'key와 name은 필수입니다',
      });
    }

    const exercise = await exerciseService.createExercise({
      key,
      name,
      category,
      defaultUnit,
    });

    res.status(201).json({
      success: true,
      message: '운동 종목이 생성되었습니다',
      data: exercise,
    });
  },

  async listExercises(_req, res) {
    const items = await exerciseService.listExercises();
    res.status(200).json({ success: true, data: items });
  },

  async getExercise(req, res) {
    const id = Number(req.params.exerciseId);
    const exercise = await exerciseService.getExercise(id);
    res.status(200).json({ success: true, data: exercise });
  },
};
