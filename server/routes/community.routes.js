const express = require('express');
const CommunityController = require('../controllers/community.controller');
const { checkPermissions } = require('../middlewares/checkPermissions.middleware');
const AuthMiddleware = require('../middlewares/auth.middleware');
const checkRole = require('../middlewares/role.middleware');
const router = express.Router();

// Community Management Routes
router.get('/search',
  AuthMiddleware(),
  checkRole(['SUPER_ADMIN', "ADMIN"]),
  checkPermissions(['VIEW_COMMUNITY']),
  CommunityController.searchCommunities
);
router.post('/',
  AuthMiddleware(),
  checkRole(['SUPER_ADMIN', "ADMIN"]),
  checkPermissions(['CREATE_COMMUNITY']),
  CommunityController.createCommunity);

router.put('/:community_id',
  AuthMiddleware(),
  checkRole(['SUPER_ADMIN', "ADMIN"]),
  checkPermissions(['UPDATE_COMMUNITY']),
  CommunityController.updateCommunity);

router.delete('/:community_id',
  AuthMiddleware(),
  checkRole(['SUPER_ADMIN', "ADMIN"]),
  checkPermissions(['DELETE_COMMUNITY']),
  CommunityController.deleteCommunity);

router.get('/name/:community_name',
  AuthMiddleware(),
  checkRole(['SUPER_ADMIN', "ADMIN"]),
  checkPermissions(['VIEW_COMMUNITY']),
  CommunityController.getCommunityByName);

router.get('/:community_id',
  AuthMiddleware(),
  checkRole(['SUPER_ADMIN', "ADMIN"]),
  checkPermissions(['VIEW_COMMUNITY']),
  CommunityController.getCommunityById);

router.get('/',
  AuthMiddleware(),
  checkPermissions(['VIEW_COMMUNITY']),
  CommunityController.getAllCommunities);

module.exports = router;
