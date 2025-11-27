// TODO) Ranking-Service: 운동 기록 랭킹 비즈니스 로직
import { NotFoundError } from '../core/error/error-handler.js';
import { recordRepo } from '../repo/record-repository.js';
import { groupRepo } from '../repo/group-repository.js';

const now = () => new Date();

const getRange = (period) => {
  const end = now();
  const start = new Date(end);
  if (period === 'month') {
    start.setDate(end.getDate() - 30);
  } else {
    start.setDate(end.getDate() - 7);
  }
  return { start, end };
};

export const rankingService = {
  async groupRanking(groupId, period = 'week') {
    const group = await groupRepo.findGroupById(groupId);
    if (!group) throw new NotFoundError('그룹을 찾을 수 없습니다');

    const { start, end } = getRange(period === 'month' ? 'month' : 'week');

    const stats = await recordRepo.aggregateByGroup(groupId, start, end);
    if (!stats.length) return [];

    const authorIds = stats.map((s) => s.authorId).filter(Boolean);
    const participants = await groupRepo.listParticipants(groupId);
    const participantMap = new Map(participants.map((p) => [p.id, p]));

    return stats.map((s, idx) => {
      const p = participantMap.get(s.authorId);
      return {
        rank: idx + 1,
        participantId: s.authorId,
        nickname: p?.nickname ?? null,
        userId: p?.userId ?? null,
        sumDistance: Number(s._sum.distance ?? 0),
        sumCount: Number(s._sum.count ?? 0),
        sumTime: Number(s._sum.time ?? 0),
        records: s._count,
      };
    });
  },
};
