// TODO) Participant-Service: 그룹 참여자 비즈니스 로직
import {
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from '../core/error/error-handler.js';
import { groupRepo } from '../repo/group-repository.js';

export const participantService = {
  async listParticipants(groupId) {
    const group = await groupRepo.findGroupById(groupId);
    if (!group) throw new NotFoundError('그룹을 찾을 수 없습니다');
    return groupRepo.listParticipants(groupId);
  },

  async updateNickname(requestUserId, groupId, participantId, nickname) {
    const group = await groupRepo.findGroupById(groupId);
    if (!group) throw new NotFoundError('그룹을 찾을 수 없습니다');

    const participant = await groupRepo.findParticipantById(participantId);
    if (!participant || participant.groupId !== groupId) {
      throw new NotFoundError('참여자를 찾을 수 없습니다');
    }

    // 권한: 본인 또는 오너만 수정
    const requester = await groupRepo.findParticipantByUser(groupId, requestUserId);
    if (!requester || (requester.id !== participant.id && requester.id !== group.ownerId)) {
      throw new UnauthorizedError('본인 또는 그룹 오너만 변경할 수 있습니다');
    }

    return groupRepo.updateParticipant(participantId, { nickname });
  },

  async removeParticipant(requestUserId, groupId, participantId) {
    const group = await groupRepo.findGroupById(groupId);
    if (!group) throw new NotFoundError('그룹을 찾을 수 없습니다');

    const participant = await groupRepo.findParticipantById(participantId);
    if (!participant || participant.groupId !== groupId) {
      throw new NotFoundError('참여자를 찾을 수 없습니다');
    }

    if (group.ownerId === participant.id) {
      throw new ConflictError('그룹 오너는 제거할 수 없습니다');
    }

    // 권한: 본인 또는 오너만 제거
    const requester = await groupRepo.findParticipantByUser(groupId, requestUserId);
    if (!requester || (requester.id !== participant.id && requester.id !== group.ownerId)) {
      throw new UnauthorizedError('본인 또는 그룹 오너만 제거할 수 있습니다');
    }

    await groupRepo.deleteParticipant(participant.id);
    return { groupId, participantId };
  },
};
