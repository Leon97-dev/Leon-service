// TODO) Validation: 공통 유효성 검사
// &) Library Import
import { assert } from 'superstruct';

//&) Core Import
import { ValidationError } from '../core/error/error-handler.js';

// &) Constant Import
import {
  VALIDATION_MESSAGES,
  REFINEMENT_MESSAGES,
  TYPE_MAP,
} from '../constants/validation-rules.js';

export default function validate(schema) {
  return (req, _res, next) => {
    try {
      assert(req.body, schema);
      next();
    } catch (error) {
      let first = null;

      // *) failures()는 iterator 또는 배열일 수 있음 → 둘 다 처리
      if (typeof error?.failures === 'function') {
        const f = error.failures();

        if (f) {
          if (typeof f.next === 'function') {
            first = f.next().value; // iterator 형태
          } else if (Array.isArray(f)) {
            first = f[0]; // 배열 형태
          }
        }
      }

      // *) path 추출 (예: ['email'] → 'email')
      const path = first?.path?.join('.') || error.path?.join?.('.') || null;

      // *) 메시지 생성 (커스텀 메시지 → failure.message → 기본 메시지 순)
      const message =
        resolveCustomMessage(path, first) ||
        first?.message ||
        '요청 데이터가 올바르지 않습니다';

      throw new ValidationError(path, message);
    }
  };
}

// ?) resolveCustomMessage: field/custom/type 기반 메시지 생성기
const resolveCustomMessage = (path, failure) => {
  // *) 필드명이 없으면 커스텀 메시지 사용 불가
  if (!path) return null;

  // *) 1. 필드 기반 메시지 매핑
  if (VALIDATION_MESSAGES[path]) {
    return VALIDATION_MESSAGES[path];
  }

  // *) 2. refinement (커스텀 규칙) 메시지 매핑
  // *) 예: failure.type === "imagePathExt"
  const refineKey = failure?.type || failure?.refinement;
  if (REFINEMENT_MESSAGES[refineKey]) {
    return REFINEMENT_MESSAGES[refineKey];
  }

  // *) 3. superstruct 기본 에러 (min, max, size, enum)
  if (failure?.type === 'min') {
    return `${path}는 최소값보다 커야 합니다.`;
  }
  if (failure?.type === 'max') {
    return `${path}는 최대값을 초과할 수 없습니다.`;
  }
  if (failure?.type === 'size') {
    return `${path}의 길이가 제한을 초과하거나 부족합니다.`;
  }
  if (failure?.type === 'enum' || failure?.type === 'enums') {
    return `${path} 값이 허용된 목록에 없습니다.`;
  }

  // *) 4. 타입(type) 기반 메시지
  // *) 예: failure.type === "string"
  if (failure?.type && TYPE_MAP[failure.type]) {
    return `${path}는 ${TYPE_MAP[failure.type]}이어야 합니다.`;
  }

  return null;
};

/**
 * &) superstruct 기본 타입 목록
 * string()
 * number()
 * boolean()
 * date()
 * array()
 * type()
 * optional()
 * nullable()
 * enums()
 * refine()
 */
