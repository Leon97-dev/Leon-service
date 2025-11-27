// TODO) Record-Routes: 그룹 운동 기록 URL 매핑
import express from 'express';
import asyncHandler from '../core/error/async-handler.js';
import { requireAuth } from '../middlewares/auth.js';
import { recordController } from '../controllers/record-controller.js';
import validate from '../validators/validation.js';
import { CreateRecord, UpdateRecord } from '../validators/record-validator.js';

const router = express.Router({ mergeParams: true });

router.get('/', asyncHandler(recordController.listByGroup));
router.post('/', requireAuth, validate(CreateRecord), asyncHandler(recordController.create));

router.get('/:recordId', asyncHandler(recordController.getOne));
router.patch(
  '/:recordId',
  requireAuth,
  validate(UpdateRecord),
  asyncHandler(recordController.update),
);
router.delete('/:recordId', requireAuth, asyncHandler(recordController.remove));

export default router;
