// TODO) Group-Controller: 그룹 요청 처리
import { groupService } from '../services/group-service.js';

export const groupController = {
  async createGroup(req, res) {
    const {
      name,
      description,
      photoUrl,
      goalRep,
      tags,
      ownerNickname,
    } = req.body;

    const missing = [['name', name], ['ownerNickname', ownerNickname]].filter(([, v]) => !v);
    if (missing.length) {
      return res.status(400).json({
        success: false,
        message: `필수 값 누락: ${missing.map(([k]) => k).join(', ')}`,
      });
    }

    const group = await groupService.createGroup(req.user.id, {
      name,
      description,
      photoUrl,
      goalRep,
      tags,
      ownerNickname,
    });

    res.status(201).json({
      success: true,
      message: '그룹이 생성되었습니다',
      data: group,
    });
  },

  async getGroup(req, res) {
    const groupId = Number(req.params.groupId);
    const group = await groupService.getGroup(groupId);
    res.status(200).json({ success: true, data: group });
  },

  async listGroups(req, res) {
    const { page, limit, search, orderBy, order } = req.query;
    const { items, total } = await groupService.listGroupsWithQuery({
      page,
      limit,
      search,
      orderBy,
      order,
    });
    res.status(200).json({ success: true, data: items, total });
  },

  async updateGroup(req, res) {
    const groupId = Number(req.params.groupId);
    const { name, description, photoUrl, goalRep, tags } = req.body;
    const updated = await groupService.updateGroup(req.user.id, groupId, {
      name,
      description,
      photoUrl,
      goalRep,
      tags,
    });

    res.status(200).json({
      success: true,
      message: '그룹이 수정되었습니다',
      data: updated,
    });
  },

  async joinGroup(req, res) {
    const groupId = Number(req.params.groupId);
    const nickname = req.body.nickname;
    if (!nickname) {
      return res.status(400).json({
        success: false,
        message: 'nickname은 필수입니다',
      });
    }
    const participant = await groupService.joinGroup(req.user.id, groupId, nickname);
    res.status(200).json({
      success: true,
      message: '그룹에 참여했습니다',
      data: participant,
    });
  },

  async leaveGroup(req, res) {
    const groupId = Number(req.params.groupId);
    const result = await groupService.leaveGroup(req.user.id, groupId);
    res.status(200).json({
      success: true,
      message: '그룹에서 탈퇴했습니다',
      data: result,
    });
  },

  async deleteGroup(req, res) {
    const groupId = Number(req.params.groupId);
    const result = await groupService.deleteGroup(req.user.id, groupId);
    res.status(200).json({
      success: true,
      message: '그룹이 삭제되었습니다',
      data: result,
    });
  },

  async likeGroup(req, res) {
    const groupId = Number(req.params.groupId);
    const result = await groupService.likeGroup(req.user.id, groupId);
    res.status(200).json({
      success: true,
      message: '좋아요가 추가되었습니다',
      data: result,
    });
  },

  async unlikeGroup(req, res) {
    const groupId = Number(req.params.groupId);
    const result = await groupService.unlikeGroup(req.user.id, groupId);
    res.status(200).json({
      success: true,
      message: '좋아요가 취소되었습니다',
      data: result,
    });
  },
};
