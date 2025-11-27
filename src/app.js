// TODO) App: 서버 진입점
// &) Config Import
import './configs/env.js'; // 맨 위 필수!
import express from 'express';
import cors from 'cors';
import path from 'path';
import cookieParser from 'cookie-parser';

// &) Core Import
import { debugLog } from './core/error/debug.js';
import { errorHandler, notFoundHandler } from './core/error/error-handler.js';

// &) Route Import
import userRoutes from './routes/user-routes.js';
import badgeRoutes from './routes/badge-routes.js';
import consentRoutes from './routes/consent-routes.js';
import groupRoutes from './routes/group-routes.js';
import exerciseRoutes from './routes/exercise-routes.js';
import uploadRoutes from './routes/upload-routes.js';

// ?) 환경 변수
const PORT = process.env.PORT || 3000;

// ?) Express 진입
const app = express();

// ?) 미들 웨어 진입
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// ?) 이미지 정적 경로 진입
app.use('/uploads', express.static(path.join(process.cwd(), 'public', 'uploads')));

// ?) 라우터 진입 (핵심)
app.use('/users', userRoutes); // 유저
app.use('/badges', badgeRoutes); // 배지
app.use('/', consentRoutes); // 정책/동의
app.use('/groups', groupRoutes); // 그룹
app.use('/exercises', exerciseRoutes); // 운동 종목
app.use('/upload', uploadRoutes); // 이미지 업로드

// ?) 404 핸들러 진입
app.use(notFoundHandler);

// ?) 전역 에러 핸들러 진입 (맨 마지막!)
app.use(errorHandler);

// ?) 서버 실행 진입
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port http://localhost:${PORT}`);
  debugLog('Debug mode is enabled');
  debugLog(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
