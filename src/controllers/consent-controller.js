// TODO) Consent-Controller: 동의/정책 요청 처리
import { consentService } from '../services/consent-service.js';

export const consentController = {
  async createPolicy(req, res) {
    const { key, version, title, description, required } = req.body;
    if (!key || !version || !title) {
      return res.status(400).json({
        success: false,
        message: 'key, version, title는 필수입니다',
      });
    }

    const policy = await consentService.createPolicy({
      key,
      version,
      title,
      description,
      required: required !== false,
    });

    res.status(201).json({
      success: true,
      message: '정책이 생성되었습니다',
      data: policy,
    });
  },

  async listPolicies(_req, res) {
    const policies = await consentService.listPolicies();
    res.status(200).json({ success: true, data: policies });
  },

  async giveConsent(req, res) {
    const { policyId, accepted } = req.body;
    if (!policyId) {
      return res.status(400).json({
        success: false,
        message: 'policyId는 필수입니다',
      });
    }

    const record = await consentService.recordConsent(req.user.id, {
      policyId: Number(policyId),
      accepted,
    });

    res.status(200).json({
      success: true,
      message: '동의 상태가 반영되었습니다',
      data: record,
    });
  },

  async listMyConsents(req, res) {
    const result = await consentService.listUserConsents(req.user.id);
    res.status(200).json({
      success: true,
      data: result,
    });
  },
};
