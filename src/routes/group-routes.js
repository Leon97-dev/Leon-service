// TODO) Group-Routes: 그룹 관련 URL 매핑
import express from 'express';
import asyncHandler from '../core/error/async-handler.js';
import { requireAuth } from '../middlewares/auth.js';
import { groupController } from '../controllers/group-controller.js';
import participantRoutes from './participant-routes.js';
import recordRoutes from './record-routes.js';
import validate from '../validators/validation.js';
import { CreateGroup, UpdateGroup, JoinGroup } from '../validators/group-validator.js';

const router = express.Router();

// 그룹 목록/단건
router.get('/', asyncHandler(groupController.listGroups));
router.get('/:groupId', asyncHandler(groupController.getGroup));

// 그룹 생성/수정
router.post('/', requireAuth, validate(CreateGroup), asyncHandler(groupController.createGroup));
router.patch('/:groupId', requireAuth, validate(UpdateGroup), asyncHandler(groupController.updateGroup));

// 그룹 참가/탈퇴
router.post('/:groupId/join', requireAuth, validate(JoinGroup), asyncHandler(groupController.joinGroup));
router.delete('/:groupId/leave', requireAuth, asyncHandler(groupController.leaveGroup));

// 그룹 참여자 하위 라우트
router.use('/:groupId/participants', participantRoutes);
router.use('/:groupId/records', recordRoutes);

export default router;
