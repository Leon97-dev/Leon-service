// TODO) Error-Handler: 클래스 기반 에러 핸들러
// ?) 클래스 기반 에러 생성 + 전역 처리 로직 요약 설명
import { debugError } from './debug.js';

// &) Global Error Handling
export class AppError extends Error {
  constructor(message, statusCode) {
    super(message); // 기본 Error의 message 설정
    this.statusCode = statusCode; // HTTP 상태 코드 저장 (400/401/404 등)
    this.isOperational = true; // ‘예상 가능한 에러’임을 표시
    this.path = null; // 유효성 에러 등에서 추가 정보 저장 용도

    // ?) 개발자가 만든 클래스 이름으로 stack trace 정리
    Error.captureStackTrace(this, this.constructor);
  }
}

// &) 404 에러 클래스
export class NotFoundError extends AppError {
  constructor(message = '리소스를 찾을 수 없습니다') {
    super(message, 404);
  }
}

// &) 401 에러 클래스
export class UnauthorizedError extends AppError {
  constructor(pathOrMessage, message = null) {
    if (message) {
      super(message, 401);
      this.path = pathOrMessage;
    } else {
      super(pathOrMessage || '비밀번호가 일치하지 않습니다', 401);
    }
  }
}

// &) 400 에러 클래스
export class ValidationError extends AppError {
  constructor(pathOrMessage, message = null) {
    if (message) {
      super(message, 400);
      this.path = pathOrMessage;
    } else {
      super(pathOrMessage || '입력 데이터가 올바르지 않습니다', 400);
    }
  }
}

// &) 409 에러 클래스
export class ConflictError extends AppError {
  constructor(message = '이미 존재하는 데이터입니다') {
    super(message, 409);
  }
}

// &) Global Error Handler (글로벌 에러 처리)
export const errorHandler = (err, req, res, next) => {
  debugError('에러 발생:', err);

  // *)1️. Prisma 에러 처리
  if (err.code === 'P2002') {
    return res.status(409).json({
      message: '이미 존재하는 데이터입니다',
      error: 'CONFLICT',
    });
  }

  if (err.code === 'P2025') {
    return res.status(404).json({
      message: '리소스를 찾을 수 없습니다',
      error: 'NOT_FOUND',
    });
  }

  // *) 2️. Multer 에러 처리 (파일 업로드)
  if (err.name === 'MulterError') {
    return res.status(400).json({
      message: err.message,
      error: 'FILE_UPLOAD_ERROR',
    });
  }

  // *) 3️. 커스텀 에러 처리
  if (err.isOperational) {
    const errorType = err.constructor.name.replace('Error', '').toUpperCase();

    const response = {
      message: err.message,
      error: errorType,
    };

    if (err.path) {
      response.path = err.path;
    }

    return res.status(err.statusCode).json(response);
  }

  // *) 4️. 예상하지 못한 에러 처리 (기본값)
  const statusCode = err.statusCode || 500;
  const message = err.message || '서버 에러가 발생했습니다';

  res.status(statusCode).json({
    message,
    error: 'SERVER_ERROR',
  });
};

// &) 404 핸들러
export const notFoundHandler = (req, res) => {
  res.status(404).json({
    message: '요청한 리소스를 찾을 수 없습니다',
    error: 'NOT_FOUND',
  });
};
