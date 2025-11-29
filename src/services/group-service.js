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

  async listGroupsWithQuery(query) {
    const { page = 1, limit = 50, search = '', orderBy = 'createdAt', order = 'desc' } = query;
    const take = Math.min(Number(limit) || 50, 100);
    const skip = ((Number(page) || 1) - 1) * take;
    const [items, total] = await Promise.all([
      groupRepo.listGroups({ search, orderBy, order, skip, take }),
      groupRepo.countGroups({ search }),
    ]);
    return { items, total };
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

  async deleteGroup(userId, groupId) {
    const group = await groupRepo.findGroupById(groupId);
    if (!group) throw new NotFoundError('그룹을 찾을 수 없습니다');

    const ownerParticipant = await groupRepo.findParticipantByUser(groupId, userId);
    if (!ownerParticipant || group.ownerId !== ownerParticipant.id) {
      throw new UnauthorizedError('그룹 오너만 삭제할 수 있습니다');
    }

    await groupRepo.deleteGroup(groupId);
    return { groupId };
  },

  async likeGroup(userId, groupId) {
    const group = await groupRepo.findGroupById(groupId);
    if (!group) throw new NotFoundError('그룹을 찾을 수 없습니다');

    const existing = await groupRepo.findLikeByUser(groupId, userId);
    if (existing) throw new ConflictError('이미 좋아요한 그룹입니다');

    const updatedGroup = await prisma.$transaction(async (tx) => {
      await groupRepo.createLike(groupId, userId, tx);
      return groupRepo.incrementLikeCount(groupId, tx);
    });

    return { groupId, likeCount: updatedGroup.likeCount };
  },

  async unlikeGroup(userId, groupId) {
    const group = await groupRepo.findGroupById(groupId);
    if (!group) throw new NotFoundError('그룹을 찾을 수 없습니다');

    const existing = await groupRepo.findLikeByUser(groupId, userId);
    if (!existing) throw new NotFoundError('좋아요 기록을 찾을 수 없습니다');

    const updatedGroup = await prisma.$transaction(async (tx) => {
      await groupRepo.deleteLike(groupId, userId, tx);
      return groupRepo.decrementLikeCount(groupId, tx);
    });

    return { groupId, likeCount: updatedGroup.likeCount };
  },

  async getLikeStatus(userId, groupId) {
    const group = await groupRepo.findGroupById(groupId);
    if (!group) throw new NotFoundError('그룹을 찾을 수 없습니다');

    const existing = await groupRepo.findLikeByUser(groupId, userId);
    return {
      groupId,
      liked: !!existing,
      likeCount: group.likeCount,
    };
  },
};
