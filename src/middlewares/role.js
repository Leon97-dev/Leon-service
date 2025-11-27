// TODO) Role: 요청마다 실행되는 커스텀 로직
// ?) 특정 역할(role)만 접근하도록 제한하는 RBAC(Role-Based Access Control) 미들웨어

export function requireRole(...roles) {
  return (req, res, next) => {
    const role = req.user?.role;

    // *) 역할 정보가 없거나 허용된 역할이 아닌 경우
    if (!role || !roles.includes(role)) {
      return res.status(403).json({
        success: false,
        message: '해당 역할의 권한이 없습니다',
      });
    }

    next();
  };
}
