// TODO) Record-Service: 운동 기록 비즈니스 로직
import {
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from '../core/error/error-handler.js';
import { recordRepo } from '../repo/record-repository.js';
import { exerciseRepo } from '../repo/exercise-repository.js';
import { groupRepo } from '../repo/group-repository.js';

export const recordService = {
  async createRecord(userId, groupId, payload) {
    const group = await groupRepo.findGroupById(groupId);
    if (!group) throw new NotFoundError('그룹을 찾을 수 없습니다');

    const participant = await groupRepo.findParticipantByUser(groupId, userId);
    if (!participant) throw new UnauthorizedError('그룹에 참여해야 기록을 남길 수 있습니다');

    const exercise = await exerciseRepo.findById(payload.exerciseId);
    if (!exercise) throw new NotFoundError('운동 종목을 찾을 수 없습니다');

    const data = {
      description: payload.description ?? null,
      time: payload.time ?? null,
      distance: payload.distance ?? null,
      count: payload.count ?? null,
      photos: payload.photos ?? [],
      exerciseId: payload.exerciseId,
      groupId,
      authorId: participant.id,
    };

    return recordRepo.createRecord(data);
  },

  async listGroupRecords(groupId) {
    const group = await groupRepo.findGroupById(groupId);
    if (!group) throw new NotFoundError('그룹을 찾을 수 없습니다');
    return recordRepo.listByGroup(groupId);
  },

  async getRecord(id) {
    const record = await recordRepo.findById(id);
    if (!record) throw new NotFoundError('기록을 찾을 수 없습니다');
    return record;
  },

  async updateRecord(userId, id, payload) {
    const record = await recordRepo.findById(id);
    if (!record) throw new NotFoundError('기록을 찾을 수 없습니다');

    const group = await groupRepo.findGroupById(record.groupId);
    const requester = await groupRepo.findParticipantByUser(record.groupId, userId);
    if (!requester) throw new UnauthorizedError('그룹에 참여해야 수정할 수 있습니다');

    if (record.authorId !== requester.id && group.ownerId !== requester.id) {
      throw new UnauthorizedError('작성자 또는 오너만 수정할 수 있습니다');
    }

    if (payload.exerciseId) {
      const exercise = await exerciseRepo.findById(payload.exerciseId);
      if (!exercise) throw new NotFoundError('운동 종목을 찾을 수 없습니다');
    }

    return recordRepo.updateRecord(id, {
      description: payload.description ?? null,
      time: payload.time ?? null,
      distance: payload.distance ?? null,
      count: payload.count ?? null,
      photos: payload.photos ?? [],
      exerciseId: payload.exerciseId ?? record.exerciseId,
    });
  },

  async deleteRecord(userId, id) {
    const record = await recordRepo.findById(id);
    if (!record) throw new NotFoundError('기록을 찾을 수 없습니다');

    const group = await groupRepo.findGroupById(record.groupId);
    const requester = await groupRepo.findParticipantByUser(record.groupId, userId);
    if (!requester) throw new UnauthorizedError('그룹에 참여해야 삭제할 수 있습니다');

    if (record.authorId !== requester.id && group.ownerId !== requester.id) {
      throw new UnauthorizedError('작성자 또는 오너만 삭제할 수 있습니다');
    }

    await recordRepo.deleteRecord(id);
    return { id };
  },
};
