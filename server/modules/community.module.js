const { Router } = require('express');
const communityRoutes = require('../routes/community.routes');
const communityUserRoutes = require('../routes/community.user.routes');
const communityPageRoutes = require('../routes/community.page.routes');

const communityModule = () => {
  const router = Router();
  router.use('/community', communityRoutes);
  router.use('/community', communityUserRoutes);
  router.use('/community', communityPageRoutes);

  return router;
};

module.exports = communityModule;
