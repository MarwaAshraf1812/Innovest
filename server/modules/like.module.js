const express = require('express');
const likeRoutes = require('../routes/like.routes');

const router = express.Router();

const likeModule = () => {
  router.use('/like', likeRoutes);
  return router;
};

module.exports = likeModule;
