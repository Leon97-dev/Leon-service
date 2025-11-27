// TODO) Logger: Winston 기반 전역 로거 (콘솔 + 일별 파일 로테이션)
// ?) 개발/운영 어디서든 안정적으로 사용 가능
import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

/**
 * &) 모듈 설치 필요
 * npm i winston
 * npm i winston-daily-rotate-file
 */

// ?) 공통 포맷 (타임스탬프 + 메시지 + 스택 추적)
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }), // 에러 스택 자동 포함
  winston.format.printf((info) => {
    return `[${info.timestamp}] ${info.level.toUpperCase()} — ${info.message}`;
  }),
);

// ?) 실제 logger 인스턴스 생성
const logger = winston.createLogger({
  level: 'info', // 운영에서는 info 이상만 출력
  format: logFormat, // 공통 포맷 적용
  transports: [
    // *) 콘솔 출력 (개발: debug / 운영: info)
    new winston.transports.Console({
      level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
      format: winston.format.combine(winston.format.colorize(), logFormat), // 개발용 색상 출력
    }),

    // ? error.log (에러만 저장)
    new DailyRotateFile({
      level: 'error',
      dirname: 'logs',
      filename: 'error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxFiles: '14d', // 최근 14일만 보관
      zippedArchive: false,
      format: logFormat,
    }),

    // ?) combined.log (전체 로그 기록)
    new DailyRotateFile({
      level: 'info',
      dirname: 'logs',
      filename: 'combined-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxFiles: '14d',
      zippedArchive: false,
      format: logFormat,
    }),
  ],
});

// ?) 개발 환경에서는 debug 레벨 활성화
if (process.env.NODE_ENV !== 'production') {
  logger.level = 'debug';
}

export default logger;
