// TODO) Ranking-Controller: 랭킹 조회
import { rankingService } from '../services/ranking-service.js';

export const rankingController = {
  async groupRanking(req, res) {
    const groupId = Number(req.params.groupId);
    const period = req.query.period === 'month' ? 'month' : 'week';

    const ranks = await rankingService.groupRanking(groupId, period);

    res.status(200).json({
      success: true,
      data: {
        period,
        ranks,
      },
    });
  },
};
