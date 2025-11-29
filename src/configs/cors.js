// TODO) CORS: 프론트에서 백엔드로 요청 허용 설정 (기본 보안)
// ?) origin 은 나중에 실제 배포 주소로 변경 필요
import './env.js';
import cors from 'cors';

const allowedOrigins = [
  process.env.CLIENT_URL, // .env에서 명시한 프론트 주소
  'http://localhost:3000', // 백엔드와 같은 포트에서 직접 접근하는 경우
  'http://localhost:3001', // 프론트 개발용(Next dev)
];

const originChecker = (origin, callback) => {
  if (!origin) return callback(null, true); // Postman 등
  if (allowedOrigins.includes(origin)) return callback(null, true);
  return callback(new Error('CORS 정책에 의해 차단된 요청입니다'), false);
};

export const corsOptions = cors({
  origin: originChecker,
  credentials: true,
});
