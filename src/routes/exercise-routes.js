// TODO) Exercise-Routes: 운동 종목 URL 매핑
import express from 'express';
import asyncHandler from '../core/error/async-handler.js';
import { requireAuth } from '../middlewares/auth.js';
import { requireRole } from '../middlewares/role.js';
import validate from '../validators/validation.js';
import { CreateExercise } from '../validators/exercise-validator.js';
import { exerciseController } from '../controllers/exercise-controller.js';

const router = express.Router();

router.get('/', asyncHandler(exerciseController.listExercises));
router.get('/:exerciseId', asyncHandler(exerciseController.getExercise));
router.post(
  '/',
  requireAuth,
  requireRole('admin'),
  validate(CreateExercise),
  asyncHandler(exerciseController.createExercise),
);

export default router;
