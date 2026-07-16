const { Router } = require('express');
const projectRoutes = require('../routes/project.routes');

const projectModule = () => {
  const router = Router();
  router.use('/project', projectRoutes);
  return router;
}

module.exports = projectModule;
