// TODO) Record-Validator: 운동 기록 유효성 검사
import * as s from 'superstruct';

const Description = s.optional(s.size(s.string(), 0, 1000));
const Time = s.optional(s.number());
const Distance = s.optional(s.number());
const Count = s.optional(s.number());
const Photos = s.optional(s.array(s.string()));

const Base = {
  exerciseId: s.number(),
  description: Description,
  time: Time,
  distance: Distance,
  count: Count,
  photos: Photos,
};

export const CreateRecord = s.object(Base);
export const UpdateRecord = s.object({ ...Base, exerciseId: s.optional(s.number()) });
