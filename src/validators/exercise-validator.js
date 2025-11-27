// TODO) Exercise-Validator: 운동 종목 유효성 검사
import * as s from 'superstruct';

const Slug = s.pattern(s.string(), /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const Name = s.size(s.string(), 1, 128);
const Category = s.optional(s.size(s.string(), 0, 64));
const DefaultUnit = s.optional(s.size(s.string(), 0, 16));

export const CreateExercise = s.object({
  key: Slug,
  name: Name,
  category: Category,
  defaultUnit: DefaultUnit,
});
