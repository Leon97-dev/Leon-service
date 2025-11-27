// TODO) User-Service: 비즈니스 로직
// &) Core Import
import {
  ConflictError,
  UnauthorizedError,
  NotFoundError,
} from '../core/error/error-handler.js';

// &) Util Import
import { hashPassword, verifyPassword } from '../utils/to-hash.js';

// &) Repo Import
import { userRepo } from '../repositories/user-repository.js';

export const userService = {
  // ?) 회원 가입
  async registerUser({ email, password, nickname, image = null }) {
    const exists = await userRepo.findUserByEmail(email);

    if (exists) {
      throw new ConflictError('이미 존재하는 email입니다');
    }

    const hashed = await hashPassword(password);
    return userRepo.createUser({ email, password: hashed, nickname, image });
  },

  // ?) 로그인
  async loginUser(email, password) {
    const user = await userRepo.findUserByEmail(email);

    if (!user) {
      throw new UnauthorizedError('이메일 또는 비밀번호가 유효하지 않습니다');
    }

    const ok = await verifyPassword(password, user.password);

    if (!ok) {
      throw new UnauthorizedError('이메일 또는 비밀번호가 유효하지 않습니다');
    }

    return user;
  },

  // ?) 내 정보 조회
  async getMe(userId) {
    const user = await userRepo.findUserById(userId);

    if (!user) {
      throw new NotFoundError('유저를 찾을 수 없습니다');
    }

    const { password, refreshToken, ...safeUser } = user;
    return safeUser;
  },

  // ?) 프로필 수정
  async changeProfile(userId, { nickname, image }) {
    const user = await userRepo.findUserById(userId);

    if (!user) throw new NotFoundError('유저를 찾을 수 없습니다');

    const updated = await userRepo.updateUser(userId, { nickname, image });
    const { password, refreshToken, ...safeUser } = updated;

    return safeUser;
  },

  // ?) 비밀번호 변경
  async changePassword(userId, oldPw, newPw) {
    const user = await userRepo.findUserById(userId);

    if (!user) {
      throw new NotFoundError('유저를 찾을 수 없습니다');
    }

    const ok = await verifyPassword(oldPw, user.password);
    
    if (!ok) {
      throw new UnauthorizedError('기존 비밀번호가 일치하지 않습니다');
    }

    const hashed = await hashPassword(newPw);
    return userRepo.updateUser(userId, { password: hashed });
  },

  // ?) 회원 탈퇴
  async deleteAccount(userId) {
    const user = await userRepo.findUserById(userId);

    if (!user) {
      throw new NotFoundError('유저를 찾을 수 없습니다');
    }

    return userRepo.deleteUser(userId);
  },
};
