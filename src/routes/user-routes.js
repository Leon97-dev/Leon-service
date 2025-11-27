// TODO) User-Routes: URL 매핑
// &) Config Import
import express from 'express';

// &) Core Import
import asyncHandler from '../core/error/async-handler.js';

// &) Middleware Import
import { requireAuth } from '../middleware/auth.js';

// &) Validator Import
import validate from '../validator/validate.js';
import {
  RegisterUser,
  LoginUser,
  UpdateProfile,
} from '../validator/user-validator.js';

// &) Controller Import
import { userController } from '../controllers/user-controller.js';

// ?) Express 라우터 생성
const router = express.Router();

// ?) 회원가입
router.post(
  '/register',
  validate(RegisterUser),
  asyncHandler(userController.register)
);

// ?) 로그인
router.post('/login', validate(LoginUser), asyncHandler(userController.login));

// ?) 내 정보 조회
router.get('/me', requireAuth, asyncHandler(userController.me));

// ?) 로그아웃
router.post('/logout', requireAuth, asyncHandler(userController.logout));

// ?) 프로필 수정
router.patch(
  '/name',
  requireAuth,
  validate(UpdateProfile),
  asyncHandler(userController.updateName)
);

// ?) 비밀번호 변경
router.patch(
  '/password',
  requireAuth,
  asyncHandler(userController.updatePassword)
);

// ?) 회원 탈퇴
router.delete('/', requireAuth, asyncHandler(userController.removeAccount));

// ?) 내가 등록한 상품 조회
router.get('/me/products', requireAuth, asyncHandler(userController.myProducts));

// ?) 토큰 재발급
router.post('/token/refresh', asyncHandler(userController.refresh));

export default router;
