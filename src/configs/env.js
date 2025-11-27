// TODO) Env Loader: 환경 설정 공용 로더
// ?) 모든 모듈에서 .env를 확실하게 읽도록 공용 로더 제공
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// *) 프로젝트 루트의 .env를 절대 경로로 로드
dotenv.config({
  path: path.resolve(__dirname, '../../.env'),
});
