// TODO) User-Validator: 유효성 검사
import * as s from 'superstruct';

const Email = s.pattern(s.string(), /^\S+@\S+\.\S+$/);
const Password = s.size(s.string(), 8, 64);
const Nickname = s.size(s.string(), 1, 30);
const Image = s.optional(
  s.union([s.pattern(s.string(), /\.(jpe?g|png)$/i), s.literal(null)])
);
  
export const RegisterUser = s.object({
  email: Email,
  password: Password,
  nickname: Nickname,
  image: Image,
});

export const UpdateProfile = s.object({
  nickname: s.optional(Nickname),
  image: Image,
});

export const LoginUser = s.object({
  email: Email,
  password: Password,
});
