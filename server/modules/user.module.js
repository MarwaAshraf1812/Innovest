const { Router } = require('express');
const adminRoutes = require('../routes/user.routes');

const adminModule = () => {
  const router = Router();
  router.use('/user', adminRoutes);
  return router;
};

module.exports = adminModule;
