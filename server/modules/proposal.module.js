const { Router } = require('express');
const proposalRoutes = require('../routes/proposal.routes');

const proposalModule = () => {
  const router = Router();
  router.use('/proposal', proposalRoutes);
  return router;
};

module.exports = proposalModule;
