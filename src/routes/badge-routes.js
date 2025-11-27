// TODO) Badge-Routes: 배지 관련 URL 매핑
import express from 'express';
import asyncHandler from '../core/error/async-handler.js';
import { requireAuth } from '../middlewares/auth.js';
import { badgeController } from '../controllers/badge-controller.js';

const router = express.Router();

// 배지 정의
router.get('/', asyncHandler(badgeController.listBadges));
router.post('/', requireAuth, asyncHandler(badgeController.createBadge));

// 유저 배지
router.get('/users/:userId', requireAuth, asyncHandler(badgeController.listUserBadges));
router.post(
  '/:badgeId/users/:userId',
  requireAuth,
  asyncHandler(badgeController.grantUserBadge),
);
router.delete(
  '/:badgeId/users/:userId',
  requireAuth,
  asyncHandler(badgeController.revokeUserBadge),
);

// 그룹 배지
router.get('/groups/:groupId', requireAuth, asyncHandler(badgeController.listGroupBadges));
router.post(
  '/:badgeId/groups/:groupId',
  requireAuth,
  asyncHandler(badgeController.grantGroupBadge),
);
router.delete(
  '/:badgeId/groups/:groupId',
  requireAuth,
  asyncHandler(badgeController.revokeGroupBadge),
);

export default router;
