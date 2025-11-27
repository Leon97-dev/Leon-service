// TODO) Auth-Service: 비즈니스 로직
// &) Library Import
import jwt from 'jsonwebtoken';

// &) Repo Import
import { userRepo } from '../repo/user-repository.js';
import { hashToken, verifyToken } from '../utils/to-hash.js';
import { UnauthorizedError } from '../core/error/error-handler.js';

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
    return jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES_IN });
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
      username: user.username,
      email: user.email ?? undefined,
      role: user.role,
    });

    const refreshToken = this.signRefreshToken({
      id: user.id,
      username: user.username,
      email: user.email ?? undefined,
      role: user.role,
    });

    const hashed = await hashToken(refreshToken);
    await userRepo.setUserRefreshToken(user.id, hashed);
    return { accessToken, refreshToken };
  },

  // ?) 액세스 토큰 재발급
  async rotateAccessToken(refreshToken) {
    let decoded;
    try {
      decoded = this.verifyRefreshToken(refreshToken);
    } catch (e) {
      throw new UnauthorizedError('refresh 토큰이 유효하지 않습니다');
    }

    const user = await userRepo.findUserById(decoded.id);
    if (!user?.refreshToken) {
      throw new UnauthorizedError('refresh 토큰이 존재하지 않습니다');
    }

    const matches = await verifyToken(refreshToken, user.refreshToken);
    if (!matches) {
      // 재사용 공격 의심 → 보유 토큰 제거
      await userRepo.clearUserRefreshToken(decoded.id);
      throw new UnauthorizedError('refresh 토큰이 무효화되었습니다');
    }

    // 새 토큰 세트 발급(로테이션)
    const accessToken = this.signAccessToken({
      id: decoded.id,
      username: decoded.username,
      email: decoded.email ?? undefined,
      role: decoded.role,
    });

    const newRefreshToken = this.signRefreshToken({
      id: decoded.id,
      username: decoded.username,
      email: decoded.email ?? undefined,
      role: decoded.role,
    });

    const hashed = await hashToken(newRefreshToken);
    await userRepo.setUserRefreshToken(decoded.id, hashed);

    return { accessToken, refreshToken: newRefreshToken };
  },

  // ?) 리프레시 토큰 제거
  clearRefreshToken(userId) {
    return userRepo.clearUserRefreshToken(userId);
  },
};
