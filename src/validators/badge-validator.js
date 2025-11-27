// TODO) Badge-Validator: 배지 유효성 검사
import * as s from 'superstruct';

const Slug = s.pattern(s.string(), /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const Name = s.size(s.string(), 1, 128);
const Description = s.optional(s.size(s.string(), 0, 500));
const Url = s.optional(s.pattern(s.string(), /^https?:\/\/.+/i));
const Category = s.optional(s.size(s.string(), 0, 64));
const IsSecret = s.optional(s.boolean());

export const CreateBadge = s.object({
  key: Slug,
  name: Name,
  description: Description,
  iconUrl: Url,
  category: Category,
  isSecret: IsSecret,
});
