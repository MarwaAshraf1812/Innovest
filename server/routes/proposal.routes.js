import express from 'express';
import ProposalController from '../controllers/proposal.controller.js';
import AuthMiddleware from '../middlewares/auth.middleware.js';
import validatePayload from '../middlewares/validatePayload.middleware.js';
import { createProposalSchema, counterProposalSchema } from '../db/validators/proposalValidator.js';

const router = express.Router();

router.post('/',
  AuthMiddleware(),
  validatePayload(createProposalSchema),
  ProposalController.createProposal
);

router.put('/:id/counter',
  AuthMiddleware(),
  validatePayload(counterProposalSchema),
  ProposalController.counterProposal
);

router.put('/:id/accept',
  AuthMiddleware(),
  ProposalController.acceptProposal
);

router.put('/:id/reject',
  AuthMiddleware(),
  ProposalController.rejectProposal
);

router.put('/:id/withdraw',
  AuthMiddleware(),
  ProposalController.withdrawProposal
);

router.get('/my',
  AuthMiddleware(),
  ProposalController.getMyProposals
);

router.get('/project/:project_id',
  AuthMiddleware(),
  ProposalController.getProposalsForProject
);

router.get('/:id',
  AuthMiddleware(),
  ProposalController.getProposalById
);

export default router;
