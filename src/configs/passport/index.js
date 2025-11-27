// TODO) Passport: 초기 설정 로직
// ?) JWT 전략 등록 및 passport 인스턴스 준비
import passport from 'passport';
import { setupJwtStrategy } from './strategies/jwt.js';

// ?) 전략 등록
export function setupPassport() {
  setupJwtStrategy();
  return passport;
}
