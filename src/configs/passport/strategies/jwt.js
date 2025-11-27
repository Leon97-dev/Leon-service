// TODO) Passport-JWT: 전략 설정 파일
// ?) JWT 토큰을 검증하고, payload 기반으로 유저를 식별하는 핵심 로직
import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { env } from '../../env.js';
import { userRepo } from '../../../repo/user-repository.js';

// ?) JWT 전략 등록 함수
// *) setupPassport()에서 호출됨
export function setupJwtStrategy() {
  passport.use(
    'jwt',
    new JwtStrategy(
      {
        // ?) 토큰 추출 방식 지정
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

        // ?) Access Token 검증 시 사용할 비밀키
        // *) 토큰 서명이 서버가 발급한 것인지 확인하는 핵심 요소
        secretOrKey: env.jwt.accessSecret,

        // ?) 만료된 토큰 자동 거부
        ignoreExpiration: false,
      },

      // ?) 검증 콜백(verify callback)
      // *) 토큰 payload 기반으로 실제 유저를 찾아 req.user에 주입하는 단계
      async (payload, done) => {
        try {
          // ?) payload.id 기준으로 유저 조회
          const user = await userRepo.findUserById(payload.id);

          // ?) 유저 없음 → 인증 실패
          if (!user) return done(null, false);

          // ?) 인증 성공 → req.user = user 저장
          return done(null, {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
          });
        } catch (err) {
          // ?) DB 오류 등 → 인증 실패 처리
          return done(err, false);
        }
      },
    ),
  );
}
