// TODO) Auth-Service: 비즈니스 로직
// &) Library Import
import jwt from 'jsonwebtoken';

// &) Repo Import
import { userRepo } from '../repositories/user-repository.js';

// ?) 환경 변수
const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const ACCESS_EXPIRES_IN = process.env.ACCESS_EXPIRES_IN ?? '1h';
const REFRESH_EXPIRES_IN = process.env.REFRESH_EXPIRES_IN ?? '14d';

export const authService = {
  // ?) 액세스 토큰 발급
  signAccessToken(payload) {
    return jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRES_IN });
  },

  // ?) 리프레시 토큰 발급
  signRefreshToken(payload) {
    return jwt.sign(payload, REFRESH_SECRET, {
      expiresIn: REFRESH_EXPIRES_IN,
    });
  },

  // ?) 액세스 토큰 검증
  verifyAccessToken(token) {
    return jwt.verify(token, ACCESS_SECRET);
  },

  // ?) 리프레시 토큰 검증
  verifyRefreshToken(token) {
    return jwt.verify(token, REFRESH_SECRET);
  },

  // ?) 토큰 세트 발급
  async generateTokens(user) {
    const accessToken = this.signAccessToken({
      id: user.id,
      email: user.email,
    });

    const refreshToken = this.signRefreshToken({
      id: user.id,
      email: user.email,
    });

    await userRepo.setUserRefreshToken(user.id, refreshToken);
    return { accessToken, refreshToken };
  },

  // ?) 액세스 토큰 재발급
  rotateAccessToken(refreshToken) {
    const decoded = this.verifyRefreshToken(refreshToken);

    return this.signAccessToken({
      id: decoded.id,
      email: decoded.email,
    });
  },

  // ?) 리프레시 토큰 제거
  clearRefreshToken(userId) {
    return userRepo.clearUserRefreshToken(userId);
  },
};
