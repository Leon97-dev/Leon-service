// TODO) Validation-Rules: 현재 프로젝트 내 규칙 모음

// ?) path(필드)별 기본 메시지: 형식은 자유
export const VALIDATION_MESSAGES = {
  email: '이메일 형식이 올바르지 않습니다.',
  password: '비밀번호는 8~64자여야 합니다.',
  nickname: '닉네임은 1~30자여야 합니다.',
  image: '이미지 확장자는 jpg, jpeg, png만 허용됩니다.',
  name: '상품명은 1~20자여야 합니다.',
  price: '가격은 0 이상이어야 합니다.',
  stock: '재고는 0 이상의 정수여야 합니다.',
  tags: 'tags는 허용된 분류 값 중 하나여야 합니다.',
  title: '제목은 1~30자여야 합니다.',
  content: '내용은 1~100자 이내여야 합니다.',
  productId: 'productId는 1 이상의 정수여야 합니다.',
  articleId: 'articleId는 1 이상의 정수여야 합니다.',
  quantity: 'quantity는 1 이상의 정수여야 합니다.',
};

// ?) 커스텀 refinement 메시지
export const REFINEMENT_MESSAGES = {
  imagePathExt: 'imagePath는 jpg, jpeg, png 확장자여야 합니다.',
};

// ?) 타입별 기본 메시지
export const TYPE_MAP = {
  string: '문자열',
  number: '숫자',
  integer: '정수',
  boolean: '불리언',
  array: '배열',
  object: '객체',
};

// ?) 범위/길이 등 숫자 기반 규칙 모음
export const FIELD_LIMITS = {
  PASSWORD_MIN: 8,
  PASSWORD_MAX: 64,
  NICKNAME_MAX: 30,
  TITLE_MAX: 30,
  CONTENT_MAX: 100,
};
