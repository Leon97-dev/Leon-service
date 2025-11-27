// TODO) Auth: 요청마다 실행되는 커스텀 로직
// ?) passport에 등록된 'jwt' 전략을 실행하여 로그인 여부를 판별하는 인증 미들웨어 (passport-jwt 방식)
// ?) 성공 시 req.user에 사용자 정보를 주입하고, 실패 시 JSON 에러로 응답한다.
// &) Library Import
import passport from 'passport';

export const requireAuth = (req, res, next) => {
  passport.authenticate(
    'jwt',
    {
      session: false, // 세션 기반 인증을 쓰지 않음 (JWT는 무상태)
      failWithError: true, // 실패 시 next(err)로 전달해 커스텀 응답 가능
    },
    (err, user, info) => {
      if (err) return next(err);

      // *) user가 없다 = JWT가 만료됨 / 서명 위조 / 토큰 없음
      if (!user) {
        return res.status(401).json({
          success: false,
          message: info?.message || '인증에 실패했습니다',
          error: 'UNAUTHORIZED',
        });
      }

      // *) 전략 검증이 통과하면, req.user에 주입해 이후 미들웨어/컨트롤러에서 사용
      req.user = user;

      next();
    },
  )(req, res, next);
};
