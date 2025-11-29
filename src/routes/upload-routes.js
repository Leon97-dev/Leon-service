// TODO) Upload-Routes: 이미지 업로드 URL 매핑
import express from 'express';
import asyncHandler from '../core/error/async-handler.js';
import { requireAuth } from '../middlewares/auth.js';
import { upload } from '../configs/multer.js';
import { uploadController } from '../controllers/upload-controller.js';

const router = express.Router();

// 이미지 단일 업로드 (회원가입 시에도 사용하므로 인증 없이 허용)
router.post('/', upload.single('image'), asyncHandler(uploadController.upload));

export default router;
