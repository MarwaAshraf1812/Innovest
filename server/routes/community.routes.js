import express from 'express';
import CommunityController from '../controllers/community.controller.js';
import { checkPermissions } from '../middlewares/checkPermissions.middleware.js';
import AuthMiddleware from '../middlewares/auth.middleware.js';
import checkRole from '../middlewares/role.middleware.js';
import validatePayload from '../middlewares/validatePayload.middleware.js';
import { createcommunityValidationSchema } from '../db/validators/communityValidator.js';

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
  validatePayload(createcommunityValidationSchema),
  CommunityController.createCommunity);

router.put('/:community_id',
  AuthMiddleware(),
  checkRole(['SUPER_ADMIN', "ADMIN"]),
  checkPermissions(['UPDATE_COMMUNITY']),
  validatePayload(createcommunityValidationSchema),
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

export default router;
