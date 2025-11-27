// TODO) User-Controller: 요청 처리
// &) Service Import
import { userService } from '../services/user-service.js';
import { authService } from '../services/auth-service.js';

export const userController = {
  // ?) 회원가입
  async register(req, res) {
    const { email, password, nickname, image } = req.body;
    const user = await userService.registerUser({
      email,
      password,
      nickname,
      image,
    });

    const tokens = await authService.generateTokens(user);

    if (tokens.refreshToken) {
      res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        sameSite: 'lax',
      });
    }

    res.status(201).json({
      success: true,
      message: '회원가입 완료',
      data: {
        user: {
          id: user.id,
          email: user.email,
          nickname: user.nickname,
          image: user.image,
        },
        ...tokens,
      },
    });
  },

  // ?) 로그인
  async login(req, res) {
    const { email, password } = req.body;
    const user = await userService.loginUser(email, password);
    const tokens = await authService.generateTokens(user);

    if (tokens.refreshToken) {
      res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        sameSite: 'lax',
      });
    }

    res.status(200).json({
      success: true,
      message: '로그인 성공',
      data: {
        user: {
          id: user.id,
          email: user.email,
          nickname: user.nickname,
          image: user.image,
        },
        ...tokens,
      },
    });
  },

  // ?) 토큰 재발급
  async refresh(req, res) {
    const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
    const accessToken = await authService.rotateAccessToken(refreshToken);

    res.status(200).json({
      success: true,
      message: '토큰 재발급 성공',
      accessToken,
    });
  },

  // ?) 로그아웃
  async logout(req, res) {
    const userId = req.user?.id;
    await authService.clearRefreshToken(userId); // 리프레쉬 토큰 제거 필수
    res.clearCookie('refreshToken'); // 쿠키 제거 필수

    res.status(200).json({
      success: true,
      message: '로그아웃 완료',
    });
  },

  // ?) 내 정보 조회
  async me(req, res) {
    const user = await userService.getMe(req.user.id);

    res.status(200).json({
      success: true,
      message: '인증 성공',
      data: user,
    });
  },

  // ?) 프로필 수정
  async updateName(req, res) {
    const profile = await userService.changeProfile(req.user.id, {
      nickname: req.body.nickname,
      image: req.body.image,
    });

    res.status(200).json({
      success: true,
      message: '프로필이 변경되었습니다',
      data: profile,
    });
  },

  // ?) 비밀번호 변경
  async updatePassword(req, res) {
    await userService.changePassword(req.user.id, req.body.oldPw, req.body.newPw);

    res.status(200).json({
      success: true,
      message: '비밀번호가 변경되었습니다',
    });
  },

  // ?) 회원 탈퇴
  async removeAccount(req, res) {
    await userService.deleteAccount(req.user.id);

    res.status(200).json({
      success: true,
      message: '계정이 삭제되었습니다',
    });
  },
};
