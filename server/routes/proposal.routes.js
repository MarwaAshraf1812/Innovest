const express = require('express');
const ProposalController = require('../controllers/proposal.controller');
const AuthMiddleware = require('../middlewares/auth.middleware');
const validatePayload = require('../middlewares/validatePayload.middleware');
const { createProposalSchema, counterProposalSchema } = require('../db/validators/proposalValidator');

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

module.exports = router;
