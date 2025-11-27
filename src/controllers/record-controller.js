// TODO) Record-Controller: 운동 기록 요청 처리
import { recordService } from '../services/record-service.js';

export const recordController = {
  async create(req, res) {
    const groupId = Number(req.params.groupId);
    const { exerciseId, description, time, distance, count, photos } = req.body;

    if (!exerciseId) {
      return res.status(400).json({
        success: false,
        message: 'exerciseId는 필수입니다',
      });
    }

    const record = await recordService.createRecord(req.user.id, groupId, {
      exerciseId: Number(exerciseId),
      description,
      time,
      distance,
      count,
      photos,
    });

    res.status(201).json({
      success: true,
      message: '기록이 생성되었습니다',
      data: record,
    });
  },

  async listByGroup(req, res) {
    const groupId = Number(req.params.groupId);
    const records = await recordService.listGroupRecords(groupId);
    res.status(200).json({ success: true, data: records });
  },

  async getOne(req, res) {
    const id = Number(req.params.recordId);
    const record = await recordService.getRecord(id);
    res.status(200).json({ success: true, data: record });
  },

  async update(req, res) {
    const id = Number(req.params.recordId);
    const { exerciseId, description, time, distance, count, photos } = req.body;
    const updated = await recordService.updateRecord(req.user.id, id, {
      exerciseId: exerciseId ? Number(exerciseId) : undefined,
      description,
      time,
      distance,
      count,
      photos,
    });

    res.status(200).json({
      success: true,
      message: '기록이 수정되었습니다',
      data: updated,
    });
  },

  async remove(req, res) {
    const id = Number(req.params.recordId);
    const result = await recordService.deleteRecord(req.user.id, id);
    res.status(200).json({
      success: true,
      message: '기록이 삭제되었습니다',
      data: result,
    });
  },
};
