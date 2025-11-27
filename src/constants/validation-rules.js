// TODO) Validation-Rules: 프로젝트 공통 검증 메시지/상수

export const VALIDATION_MESSAGES = {
  // 사용자
  username: '아이디는 1~64자여야 합니다.',
  password: '비밀번호는 8~64자여야 합니다.',
  email: '이메일 형식이 올바르지 않습니다.',
  nickName: '닉네임은 1~64자여야 합니다.',
  profileImageUrl: '프로필 이미지는 http(s) URL 이어야 합니다.',
  birthDate: '생년월일은 YYYYMMDD 형식이어야 합니다.',
  phoneNumber: '전화번호 형식이 올바르지 않습니다.',
  carrier: '통신사 값이 올바르지 않습니다.',
  gender: '성별 값이 올바르지 않습니다.',
  nationality: '국적 값이 올바르지 않습니다.',

  // 그룹/참여자
  name: '그룹 이름은 1~100자여야 합니다.',
  ownerNickname: '오너 닉네임은 1~64자여야 합니다.',
  nickname: '닉네임은 1~64자여야 합니다.',
  description: '설명은 500자 이내여야 합니다.',
  photoUrl: '사진 URL은 http(s) 형식이어야 합니다.',
  discordWebhookUrl: '웹훅 URL 형식이 올바르지 않습니다.',
  discordInviteUrl: '초대 URL 형식이 올바르지 않습니다.',

  // 배지/정책
  key: 'key는 슬러그 형식이어야 합니다.',
  version: 'version은 1~32자여야 합니다.',
  title: 'title은 1~128자여야 합니다.',
  iconUrl: '아이콘 URL은 http(s) 형식이어야 합니다.',
  category: 'category는 64자 이하이어야 합니다.',

  // 운동/기록
  exerciseId: 'exerciseId는 숫자여야 합니다.',
  time: 'time은 숫자여야 합니다.',
  distance: 'distance는 숫자여야 합니다.',
  count: 'count는 숫자여야 합니다.',
};

export const REFINEMENT_MESSAGES = {};

export const TYPE_MAP = {
  string: '문자열',
  number: '숫자',
  integer: '정수',
  boolean: '불리언',
  array: '배열',
  object: '객체',
};

export const FIELD_LIMITS = {
  PASSWORD_MIN: 8,
  PASSWORD_MAX: 64,
  USERNAME_MAX: 64,
  NICKNAME_MAX: 64,
  GROUP_NAME_MAX: 100,
  DESCRIPTION_MAX: 500,
  TITLE_MAX: 128,
};
