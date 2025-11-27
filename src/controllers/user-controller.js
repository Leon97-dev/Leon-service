// TODO) User-Controller: 요청 처리
// &) Service Import
import { userService } from '../services/user-service.js';
import { authService } from '../services/auth-service.js';

const isProd = process.env.NODE_ENV === 'production';

export const userController = {
  // ?) 회원가입
  async register(req, res) {
    const {
      username,
      password,
      email,
      nickName,
      profileImageUrl,
      birthDate,
      carrier,
      gender,
      nationality,
      phoneNumber,
    } = req.body;

    const missing = [
      ['username', username],
      ['password', password],
      ['birthDate', birthDate],
      ['carrier', carrier],
      ['gender', gender],
      ['nationality', nationality],
      ['phoneNumber', phoneNumber],
    ].filter(([, v]) => !v);
    if (missing.length) {
      return res.status(400).json({
        success: false,
        message: `필수 값 누락: ${missing.map(([k]) => k).join(', ')}`,
      });
    }

    const user = await userService.registerUser({
      username,
      password,
      email,
      nickName,
      profileImageUrl,
      birthDate,
      carrier,
      gender,
      nationality,
      phoneNumber,
    });

    const tokens = await authService.generateTokens(user);

    if (tokens.refreshToken) {
      res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        sameSite: isProd ? 'none' : 'lax',
        secure: isProd,
      });
    }

    res.status(201).json({
      success: true,
      message: '회원가입 완료',
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          nickName: user.nickName,
          profileImageUrl: user.profileImageUrl,
        },
        ...tokens,
      },
    });
  },

  // ?) 로그인
  async login(req, res) {
    const identifier = req.body.username || req.body.email || req.body.identifier;
    const { password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message: 'username(email)과 password는 필수입니다',
      });
    }

    const user = await userService.loginUser(identifier, password);
    const tokens = await authService.generateTokens(user);

    if (tokens.refreshToken) {
      res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        sameSite: isProd ? 'none' : 'lax',
        secure: isProd,
      });
    }

    res.status(200).json({
      success: true,
      message: '로그인 성공',
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          nickName: user.nickName,
          profileImageUrl: user.profileImageUrl,
        },
        ...tokens,
      },
    });
  },

  // ?) 토큰 재발급
  async refresh(req, res) {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ success: false, message: 'refreshToken이 없습니다' });
    }
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
      nickName: req.body.nickName,
      profileImageUrl: req.body.profileImageUrl,
    });

    res.status(200).json({
      success: true,
      message: '프로필이 변경되었습니다',
      data: profile,
    });
  },

  // ?) 비밀번호 변경
  async updatePassword(req, res) {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: '비번을 다시 입력해주세요',
      });
    }

    await userService.changePassword(req.user.id, oldPassword, newPassword);

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
