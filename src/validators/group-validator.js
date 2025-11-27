// TODO) Group-Validator: 그룹 유효성 검사
import * as s from 'superstruct';

const Name = s.size(s.string(), 1, 100);
const Description = s.optional(s.size(s.string(), 0, 500));
const PhotoUrl = s.optional(s.pattern(s.string(), /^https?:\/\/.+/i));
const GoalRep = s.optional(s.number());
const Tags = s.optional(s.array(s.string()));
const WebhookUrl = s.optional(s.pattern(s.string(), /^https?:\/\/.+/i));
const InviteUrl = s.optional(s.pattern(s.string(), /^https?:\/\/.+/i));
const Nickname = s.size(s.string(), 1, 64);

export const CreateGroup = s.object({
  name: Name,
  description: Description,
  photoUrl: PhotoUrl,
  goalRep: GoalRep,
  tags: Tags,
  discordWebhookUrl: WebhookUrl,
  discordInviteUrl: InviteUrl,
  ownerNickname: Nickname,
});

export const UpdateGroup = s.object({
  name: s.optional(Name),
  description: Description,
  photoUrl: PhotoUrl,
  goalRep: GoalRep,
  tags: Tags,
  discordWebhookUrl: WebhookUrl,
  discordInviteUrl: InviteUrl,
});

export const JoinGroup = s.object({
  nickname: Nickname,
});
