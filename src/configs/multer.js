// TODO) Multer-Loader: 환경, 설정, 공통 미들웨어 정의
// ?) 이미지 업로드 설정
import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import fs from 'fs';

// ?) 파일 크기 제한
const limits = { fileSize: 5 * 1024 * 1024 }; // 5MB
// ^) 파일 사이즈는 상수로 빼둬야 정책바뀜, 테스트 때 접근성이 좋다!

// ?) 업로드 폴더 생성 (없으면 자동 생성)
const uploadDir = path.join(process.cwd(), 'public', 'uploads');
fs.mkdirSync(uploadDir, { recursive: true });

// ?) 파일 저장 방식 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const validExt = ['.jpg', '.jpeg', '.png'].includes(ext) ? ext : '';
    cb(null, crypto.randomUUID() + validExt);
  },
});

// ?) 허용 MIME 타입 필터링
const fileFilter = (req, file, cb) => {
  const isValidType = ['image/jpeg', 'image/png'].includes(file.mimetype);
  cb(isValidType ? null : new Error('jpeg/png만 업로드 가능합니다.'), isValidType);
};

// ?) 최종 업로드 인스턴스
export const upload = multer({
  storage,
  limits,
  fileFilter,
});
