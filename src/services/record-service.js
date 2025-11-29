// TODO) Record-Service: 운동 기록 비즈니스 로직
import {
  ConflictError,
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from '../core/error/error-handler.js';
import { recordRepo } from '../repo/record-repository.js';
import { exerciseRepo } from '../repo/exercise-repository.js';
import { groupRepo } from '../repo/group-repository.js';
import { badgeService } from './badge-service.js';
import { BADGE_KEYS } from '../constants/badge-keys.js';

const validateUnits = (defaultUnit, payload) => {
  const hasTime = payload.time !== undefined && payload.time !== null;
  const hasDistance = payload.distance !== undefined && payload.distance !== null;
  const hasCount = payload.count !== undefined && payload.count !== null;

  // defaultUnit에 따른 필수 값 검증 (없으면 스킵)
  if (defaultUnit === 'time' && !hasTime) {
    throw new ValidationError('time', 'time 값이 필요합니다');
  }
  if (defaultUnit === 'distance' && !hasDistance) {
    throw new ValidationError('distance', 'distance 값이 필요합니다');
  }
  if (defaultUnit === 'count' && !hasCount) {
    throw new ValidationError('count', 'count 값이 필요합니다');
  }

  // 상충하는 경우는 허용(추가 입력), 최소 필수만 체크
};
export const recordService = {
  async createRecord(userId, groupId, payload) {
    const group = await groupRepo.findGroupById(groupId);
    if (!group) throw new NotFoundError('그룹을 찾을 수 없습니다');

    const participant = await groupRepo.findParticipantByUser(groupId, userId);
    if (!participant) throw new UnauthorizedError('그룹에 참여해야 기록을 남길 수 있습니다');

    const exercise = await exerciseRepo.findById(payload.exerciseId);
    if (!exercise) throw new NotFoundError('운동 종목을 찾을 수 없습니다');

    validateUnits(exercise.defaultUnit, payload);

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

    const record = await recordRepo.createRecord(data);

    // 자동 배지 부여: 첫 기록 배지 (배지가 없으면 무시)
    await badgeService.grantUserBadgeByKey(userId, BADGE_KEYS.FIRST_RECORD).catch(() => {});

    return record;
  },

  async listGroupRecords(groupId) {
    const group = await groupRepo.findGroupById(groupId);
    if (!group) throw new NotFoundError('그룹을 찾을 수 없습니다');
    return recordRepo.listByGroup(groupId);
  },

  async listGroupRecordsWithQuery(groupId, query) {
    const group = await groupRepo.findGroupById(groupId);
    if (!group) throw new NotFoundError('그룹을 찾을 수 없습니다');

    const { page = 1, limit = 50, search = '', orderBy = 'createdAt', order = 'desc' } = query;
    const take = Math.min(Number(limit) || 50, 100);
    const skip = ((Number(page) || 1) - 1) * take;

    const [items, total] = await Promise.all([
      recordRepo.listByGroupWithQuery(groupId, { search, orderBy, order, skip, take }),
      recordRepo.countByGroup(groupId, { search }),
    ]);

    return { items, total };
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

    const targetExerciseId = payload.exerciseId ?? record.exerciseId;
    const exercise = await exerciseRepo.findById(targetExerciseId);
    if (!exercise) throw new NotFoundError('운동 종목을 찾을 수 없습니다');

    validateUnits(exercise.defaultUnit, payload);

    return recordRepo.updateRecord(id, {
      description: payload.description ?? null,
      time: payload.time ?? null,
      distance: payload.distance ?? null,
      count: payload.count ?? null,
      photos: payload.photos ?? [],
      exerciseId: targetExerciseId,
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
