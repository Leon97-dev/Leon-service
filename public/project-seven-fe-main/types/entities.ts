export enum RankDuration {
  MONTH = 'month',
  WEEK = 'week',
}

export interface Participant {
  id: number;
  nickname: string;
  userId?: number | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface Group {
  id: number;
  name: string;
  description?: string | null;
  photoUrl?: string | null;
  goalRep: number;
  discordWebhookUrl?: string | null;
  discordInviteUrl?: string | null;
  likeCount: number;
  tags: string[];
  ownerId?: number | null;
  ownerNickname?: string | null;
  owner?: Participant | null;
  participants?: Participant[];
  createdAt?: string;
  updatedAt?: string;
}

export interface GroupCreate {
  name: string;
  description?: string;
  photoUrl?: string | null;
  goalRep?: number;
  tags?: string[];
  ownerNickname: string;
}

export type GroupUpdate = Partial<GroupCreate>;

export interface GroupDelete {
  // 현재 백엔드에서는 오너만 삭제 권한, 별도 비밀번호 없음
}

export interface GroupJoin {
  nickname: string;
}

export interface Exercise {
  id: number;
  key: string;
  name: string;
  category?: string | null;
  defaultUnit?: string | null;
}

export interface Record {
  id: number;
  description?: string | null;
  time?: number | null;
  distance?: number | null;
  count?: number | null;
  photos: string[];
  exerciseId: number;
  exercise?: Exercise | null;
  authorId?: number | null;
  author?: Participant | null;
  groupId: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface RecordCreate {
  exerciseId: number;
  description?: string;
  time?: number;
  distance?: number;
  count?: number;
  photos?: string[];
}

export interface Rank {
  rank: number;
  participantId: number;
  nickname: string | null;
  userId: number | null;
  sumDistance: number;
  sumCount: number;
  sumTime: number;
  records: number;
}

export interface User {
  id: number;
  username: string;
  email?: string | null;
  nickName?: string | null;
  profileImageUrl?: string | null;
  role: 'user' | 'admin';
}
