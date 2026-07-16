const { Router } = require('express');
const commentRoutes = require('../routes/comment.routes');

const commentModule = () => {
  const router = Router();
  router.use('/comments', commentRoutes);
  return router;
};

module.exports = commentModule;
