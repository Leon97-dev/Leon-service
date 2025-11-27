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
import { userRepo } from '../repo/user-repository.js';

export const userService = {
  // ?) 회원 가입
  async registerUser({
    username,
    password,
    email,
    nickName,
    profileImageUrl = null,
    birthDate,
    carrier,
    gender,
    nationality,
    phoneNumber,
  }) {
    const [byUsername, byEmail, byPhone, byNick] = await Promise.all([
      userRepo.findUserByUsername(username),
      email ? userRepo.findUserByEmail(email) : null,
      userRepo.findUserByPhone(phoneNumber),
      nickName ? userRepo.findUserByNickName(nickName) : null,
    ]);

    if (byUsername) throw new ConflictError('이미 존재하는 username입니다');
    if (byEmail) throw new ConflictError('이미 존재하는 email입니다');
    if (byPhone) throw new ConflictError('이미 존재하는 phoneNumber입니다');
    if (byNick) throw new ConflictError('이미 존재하는 nickName입니다');

    const hashed = await hashPassword(password);
    return userRepo.createUser({
      username,
      password: hashed,
      email,
      nickName,
      profileImageUrl,
      birthDate,
      carrier,
      gender,
      nationality,
      phoneNumber,
      role: 'user',
    });
  },

  // ?) 로그인
  async loginUser(identifier, password) {
    const user =
      (await userRepo.findUserByUsername(identifier)) ||
      (await userRepo.findUserByEmail(identifier));

    if (!user) {
      throw new UnauthorizedError('계정 또는 비밀번호가 유효하지 않습니다');
    }

    const ok = await verifyPassword(password, user.password);

    if (!ok) {
      throw new UnauthorizedError('계정 또는 비밀번호가 유효하지 않습니다');
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
  async changeProfile(userId, { nickName, profileImageUrl }) {
    const user = await userRepo.findUserById(userId);

    if (!user) throw new NotFoundError('유저를 찾을 수 없습니다');

    const updated = await userRepo.updateUser(userId, { nickName, profileImageUrl });
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
