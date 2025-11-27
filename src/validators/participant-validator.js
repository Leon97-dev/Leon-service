// TODO) Participant-Validator: 참여자 유효성 검사
import * as s from 'superstruct';

const Nickname = s.size(s.string(), 1, 64);

export const UpdateParticipant = s.object({
  nickname: Nickname,
});
