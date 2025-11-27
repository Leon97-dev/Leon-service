// TODO) CORS: 프론트에서 백엔드로 요청 허용 설정 (기본 보안)
// ?) origin 은 나중에 실제 배포 주소로 변경 필요
import './env.js';
import cors from 'cors';

const allowedOrigins = [
  process.env.CLIENT_URL, // .env에서 명시한 프론트 주소
  'http://localhost:3000', // 개발용
];

export const corsOptions = cors({
  origin: (origin, callback) => {
    // origin이 없는 경우(예: Postman) 허용
    if (!origin) return callback(null, true);

    // 허용된 도메인만 받아줌
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // 나머지는 차단
    return callback(new Error('CORS 정책에 의해 차단된 요청입니다'), false);
  },

  credentials: true, // 인증/쿠키 필요할 때 true
});

