const { Router } = require('express');
const adminRoutes = require('../routes/admin.routes');

const adminModule = () => {
  const router = Router();
  router.use('/admin', adminRoutes);
  return router;
};

module.exports = adminModule;
