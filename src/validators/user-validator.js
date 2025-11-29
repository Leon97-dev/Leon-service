// TODO) User-Validator: 유효성 검사
import * as s from 'superstruct';

const Email = s.pattern(s.string(), /^\S+@\S+\.\S+$/);
const Password = s.size(s.string(), 8, 64);
const Username = s.size(s.string(), 1, 64);
const Nickname = s.size(s.string(), 1, 64);
const ImageUrl = s.optional(s.pattern(s.string(), /^(https?:\/\/.+|\/.+)$/i));
const BirthDate = s.pattern(s.string(), /^\d{8}$/);
const Carrier = s.enums(['SKT', 'KT', 'LGU', 'MVNO']);
const Gender = s.enums(['male', 'female']);
const Nationality = s.enums(['domestic', 'foreign']);
const PhoneNumber = s.pattern(s.string(), /^[0-9+\-]{5,32}$/);

export const RegisterUser = s.object({
  username: Username,
  password: Password,
  email: Email,
  nickName: Nickname,
  profileImageUrl: ImageUrl,
  birthDate: BirthDate,
  carrier: Carrier,
  gender: Gender,
  nationality: Nationality,
  phoneNumber: PhoneNumber,
});

export const UpdateProfile = s.object({
  nickName: s.optional(Nickname),
  profileImageUrl: ImageUrl,
});

const LoginBase = s.object({
  identifier: s.optional(s.string()),
  username: s.optional(s.string()),
  email: s.optional(Email),
  password: Password,
});

export const LoginUser = s.refine(LoginBase, 'loginIdentifier', (value) => {
  return Boolean(value.identifier || value.username || value.email);
});
