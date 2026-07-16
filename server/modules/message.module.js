const { Router } = require('express');
const messageRoutes = require('../routes/message.routes');

const messageModule = () => {
  const router = Router();
  router.use('/message', messageRoutes);
  return router;
};

module.exports = messageModule;
