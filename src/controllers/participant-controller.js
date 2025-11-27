// TODO) Participant-Controller: 그룹 참여자 요청 처리
import { participantService } from '../services/participant-service.js';

export const participantController = {
  async list(req, res) {
    const groupId = Number(req.params.groupId);
    const participants = await participantService.listParticipants(groupId);
    res.status(200).json({ success: true, data: participants });
  },

  async updateNickname(req, res) {
    const groupId = Number(req.params.groupId);
    const participantId = Number(req.params.participantId);
    const { nickname } = req.body;
    if (!nickname) {
      return res.status(400).json({
        success: false,
        message: 'nickname은 필수입니다',
      });
    }

    const updated = await participantService.updateNickname(
      req.user.id,
      groupId,
      participantId,
      nickname,
    );

    res.status(200).json({
      success: true,
      message: '닉네임이 변경되었습니다',
      data: updated,
    });
  },

  async remove(req, res) {
    const groupId = Number(req.params.groupId);
    const participantId = Number(req.params.participantId);

    const result = await participantService.removeParticipant(req.user.id, groupId, participantId);

    res.status(200).json({
      success: true,
      message: '참여자가 제거되었습니다',
      data: result,
    });
  },
};
