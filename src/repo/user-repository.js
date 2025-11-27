// TODO) User-Repository: DB 저장소
// &) Config Import
import prisma from '../config/prisma.js';

export const userRepo = {
  // ?) 유저 생성
  createUser(data) {
    return prisma.user.create({ data });
  },

  // ?) 이메일로 조회
  findUserByEmail(email) {
    return prisma.user.findUnique({ where: { email } });
  },

  // ?) 아이디로 조회
  findUserById(id) {
    return prisma.user.findUnique({ where: { id } });
  },

  // ?) 유저 수정
  updateUser(id, data) {
    return prisma.user.update({ where: { id }, data });
  },

  // ?) 유저 삭제
  deleteUser(id) {
    return prisma.user.delete({ where: { id } });
  },

  // ?) 리프레시 토큰 저장
  setUserRefreshToken(userId, token) {
    return prisma.user.update({
      where: { id: userId },
      data: { refreshToken: token },
    });
  },

  // ?) 리프레시 토큰 제거
  clearUserRefreshToken(userId) {
    return prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
  },
};
