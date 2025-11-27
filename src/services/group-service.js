// TODO) Group-Service: 그룹 비즈니스 로직
import {
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from '../core/error/error-handler.js';
import prisma from '../configs/prisma.js';
import { groupRepo } from '../repo/group-repository.js';

export const groupService = {
  // 그룹 생성 + 오너 참가자 생성 + 오너 설정
  async createGroup(ownerUserId, payload) {
    const {
      name,
      description = null,
      photoUrl = null,
      goalRep = 100,
      tags = [],
      discordWebhookUrl = null,
      discordInviteUrl = null,
      ownerNickname,
    } = payload;

    if (!ownerNickname) {
      throw new ConflictError('오너 닉네임(ownerNickname)은 필수입니다');
    }

    return prisma.$transaction(async (tx) => {
      const group = await groupRepo.createGroup(
        {
          name,
          description,
          photoUrl,
          goalRep,
          tags,
          discordWebhookUrl,
          discordInviteUrl,
          likeCount: 0,
        },
        tx,
      );

      const ownerParticipant = await groupRepo.createParticipant(
        {
          nickname: ownerNickname,
          groupId: group.id,
          userId: ownerUserId,
        },
        tx,
      );

      const updatedGroup = await groupRepo.updateGroup(
        group.id,
        { ownerId: ownerParticipant.id },
        tx,
      );

      return { ...updatedGroup, owner: ownerParticipant };
    });
  },

  async getGroup(id) {
    const group = await groupRepo.findGroupWithParticipants(id);
    if (!group) throw new NotFoundError('그룹을 찾을 수 없습니다');
    return group;
  },

  listGroups() {
    return groupRepo.listGroups();
  },

  async updateGroup(userId, groupId, data) {
    const group = await groupRepo.findGroupById(groupId);
    if (!group) throw new NotFoundError('그룹을 찾을 수 없습니다');

    // 오너 확인
    const ownerParticipant = await groupRepo.findParticipantByUser(groupId, userId);
    if (!ownerParticipant || group.ownerId !== ownerParticipant.id) {
      throw new UnauthorizedError('그룹 오너만 수정할 수 있습니다');
    }

    return groupRepo.updateGroup(groupId, data);
  },

  async joinGroup(userId, groupId, nickname) {
    const group = await groupRepo.findGroupById(groupId);
    if (!group) throw new NotFoundError('그룹을 찾을 수 없습니다');

    const existing = await groupRepo.findParticipantByUser(groupId, userId);
    if (existing) throw new ConflictError('이미 참여한 그룹입니다');

    return groupRepo.createParticipant({ groupId, userId, nickname });
  },

  async leaveGroup(userId, groupId) {
    const group = await groupRepo.findGroupById(groupId);
    if (!group) throw new NotFoundError('그룹을 찾을 수 없습니다');

    const participant = await groupRepo.findParticipantByUser(groupId, userId);
    if (!participant) throw new NotFoundError('참여 정보를 찾을 수 없습니다');

    if (group.ownerId === participant.id) {
      throw new ConflictError('오너는 그룹을 탈퇴할 수 없습니다');
    }

    await groupRepo.deleteParticipant(participant.id);
    return { groupId, userId };
  },
};
