// TODO) Debug: 디버그 전용 유틸 (배포 환경에서는 반드시 꺼야 함)
// ?) DEBUG_MODE = true 일 때만 모든 디버그 출력이 동작
const DEBUG_MODE = process.env.DEBUG_MODE === 'true';

/**
 * &) debugLog()
 * 일반 디버그 로그 출력 (console.log)
 * 개발 환경에서 API 흐름/변수 확인에 사용
 */
export const debugLog = (...args) => {
  if (DEBUG_MODE) {
    console.log('[DEBUG]', ...args);
  }
};

/**
 * &) debugError()
 * 에러 상황을 디버그 모드에서만 출력 (console.error)
 * error-handler.js 내부에서 활용
 */
export const debugError = (...args) => {
  if (DEBUG_MODE) {
    console.error('[DEBUG ERROR]', ...args);
  }
};

/**
 * &) debugWarn()
 * 경고성 메시지 출력 (console.warn)
 */
export const debugWarn = (...args) => {
  if (DEBUG_MODE) {
    console.warn('[DEBUG WARN]', ...args);
  }
};

/**
 * &) isDebugMode()
 * 현재 디버그 모드인지 여부를 Boolean으로 반환
 */
export const isDebugMode = () => DEBUG_MODE;

/**
 * &) runInDebugMode(fn)
 * 디버그 모드일 때만 특정 함수를 실행
 * @example
 * runInDebugMode(() => console.log('개발 모드 전용 실행'));
 */
export const runInDebugMode = (fn) => {
  if (DEBUG_MODE && typeof fn === 'function') {
    fn();
  }
};

/**
 * &) startTimer(label)
 * API 성능 측정용 (미들웨어에서 사용)
 * @example
 * const end = startTimer('DB 조회');
 * ... DB 작업 ...
 * end();
 */
export const startTimer = (label) => {
  if (!DEBUG_MODE) return () => {}; // 배포에서는 완전 무효(no-op)

  const startTime = Date.now();
  return () => {
    const endTime = Date.now();
    debugLog(`[타이머] ${label}: ${endTime - startTime}ms`);
  };
};

/**
 * &) debugObject(obj)
 * 객체를 보기 좋게 출력 (depth 제한 없음 + 색상)
 * 복잡한 객체 구조 디버깅할 때 유용
 */
export const debugObject = (obj, label = 'Object') => {
  if (DEBUG_MODE) {
    console.log(`[DEBUG ${label}]`);
    console.dir(obj, { depth: null, colors: true });
  }
};

/**
 * &) debugTable(data)
 * 배열 또는 객체를 테이블 형태로 출력
 * 목록 확인 등에서 유용
 */
export const debugTable = (data, label = '') => {
  if (DEBUG_MODE) {
    if (label) console.log(`[DEBUG] ${label}`);
    console.table(data);
  }
};
