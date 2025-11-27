// TODO) Badge-Controller: 배지 관련 요청 처리
import { badgeService } from '../services/badge-service.js';

const isProd = process.env.NODE_ENV === 'production';

export const badgeController = {
  // 배지 정의 생성
  async createBadge(req, res) {
    const { key, name, description, iconUrl, category, isSecret } = req.body;
    if (!key || !name) {
      return res.status(400).json({
        success: false,
        message: 'key와 name은 필수입니다',
      });
    }
    const badge = await badgeService.createBadge({
      key,
      name,
      description,
      iconUrl,
      category,
      isSecret: Boolean(isSecret),
    });

    res.status(201).json({
      success: true,
      message: '배지가 생성되었습니다',
      data: badge,
    });
  },

  async listBadges(_req, res) {
    const badges = await badgeService.listBadges();
    res.status(200).json({ success: true, data: badges });
  },

  // 유저 배지 부여/회수
  async grantUserBadge(req, res) {
    const { badgeId, userId } = req.params;
    const { expiresAt, metadata } = req.body;

    const record = await badgeService.grantUserBadge({
      badgeId: Number(badgeId),
      userId: Number(userId),
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      grantedBy: req.user?.id ? String(req.user.id) : undefined,
      metadata: metadata ?? null,
    });

    res.status(200).json({
      success: true,
      message: '유저 배지가 부여되었습니다',
      data: record,
    });
  },

  async revokeUserBadge(req, res) {
    const { badgeId, userId } = req.params;
    const record = await badgeService.revokeUserBadge(Number(userId), Number(badgeId));
    res.status(200).json({
      success: true,
      message: '유저 배지가 만료 처리되었습니다',
      data: record,
    });
  },

  async listUserBadges(req, res) {
    const { userId } = req.params;
    const badges = await badgeService.listUserBadges(Number(userId));
    res.status(200).json({ success: true, data: badges });
  },

  // 그룹 배지 부여/회수
  async grantGroupBadge(req, res) {
    const { badgeId, groupId } = req.params;
    const { expiresAt, metadata } = req.body;

    const record = await badgeService.grantGroupBadge({
      badgeId: Number(badgeId),
      groupId: Number(groupId),
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      grantedBy: req.user?.id ? String(req.user.id) : undefined,
      metadata: metadata ?? null,
    });

    res.status(200).json({
      success: true,
      message: '그룹 배지가 부여되었습니다',
      data: record,
    });
  },

  async revokeGroupBadge(req, res) {
    const { badgeId, groupId } = req.params;
    const record = await badgeService.revokeGroupBadge(Number(groupId), Number(badgeId));
    res.status(200).json({
      success: true,
      message: '그룹 배지가 만료 처리되었습니다',
      data: record,
    });
  },

  async listGroupBadges(req, res) {
    const { groupId } = req.params;
    const badges = await badgeService.listGroupBadges(Number(groupId));
    res.status(200).json({ success: true, data: badges });
  },
};
