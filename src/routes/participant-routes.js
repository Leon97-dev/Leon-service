// TODO) Participant-Routes: 그룹 참여자 URL 매핑
import express from 'express';
import asyncHandler from '../core/error/async-handler.js';
import { requireAuth } from '../middlewares/auth.js';
import { participantController } from '../controllers/participant-controller.js';
import validate from '../validators/validation.js';
import { UpdateParticipant } from '../validators/participant-validator.js';

const router = express.Router({ mergeParams: true });

// 그룹 참여자 목록
router.get('/', requireAuth, asyncHandler(participantController.list));

// 닉네임 변경
router.patch(
  '/:participantId',
  requireAuth,
  validate(UpdateParticipant),
  asyncHandler(participantController.updateNickname),
);

// 참여자 제거
router.delete('/:participantId', requireAuth, asyncHandler(participantController.remove));

export default router;
