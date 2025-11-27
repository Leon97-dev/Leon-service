// TODO) Consent-Validator: 정책/동의 유효성 검사
import * as s from 'superstruct';

const Key = s.pattern(s.string(), /^[a-z0-9_.-]+$/i);
const Version = s.size(s.string(), 1, 32);
const Title = s.size(s.string(), 1, 128);
const Description = s.optional(s.size(s.string(), 0, 2000));

export const CreatePolicy = s.object({
  key: Key,
  version: Version,
  title: Title,
  description: Description,
  required: s.optional(s.boolean()),
});

export const GiveConsent = s.object({
  policyId: s.number(),
  accepted: s.optional(s.boolean()),
});
