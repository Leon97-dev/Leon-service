// TODO) Consent-Routes: 정책/동의 URL 매핑
import express from 'express';
import asyncHandler from '../core/error/async-handler.js';
import { requireAuth } from '../middlewares/auth.js';
import validate from '../validators/validation.js';
import { CreatePolicy, GiveConsent } from '../validators/consent-validator.js';
import { consentController } from '../controllers/consent-controller.js';

const router = express.Router();

// 정책
router.get('/policies', asyncHandler(consentController.listPolicies));
router.post('/policies', requireAuth, validate(CreatePolicy), asyncHandler(consentController.createPolicy));

// 동의
router.get('/consents', requireAuth, asyncHandler(consentController.listMyConsents));
router.post('/consents', requireAuth, validate(GiveConsent), asyncHandler(consentController.giveConsent));

export default router;
