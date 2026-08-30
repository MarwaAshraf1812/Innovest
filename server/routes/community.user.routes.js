import express from 'express';
import CommunityController from '../controllers/community.controller.js';
import { checkPermissions } from '../middlewares/checkPermissions.middleware.js';
import AuthMiddleware from '../middlewares/auth.middleware.js';
import checkRole from '../middlewares/role.middleware.js';

const router = express.Router();

// User Management in Community Routes
router.get('/users/pending-users',
  AuthMiddleware(),
  checkRole(['SUPER_ADMIN', "ADMIN"]),
  checkPermissions(['APPROVE_USER']),
  CommunityController.getPendingUsers);

router.get('/memberships/my',
  AuthMiddleware(),
  CommunityController.getMyMemberships);

router.post('/:community_id/join',
  AuthMiddleware(),
  checkPermissions(['JOIN_COMMUNITY']),
  CommunityController.addUserToPendingUsers);

router.get('/:community_id/approve-user/:user_id',
  AuthMiddleware(),
  checkRole(['SUPER_ADMIN', "ADMIN"]),
  checkPermissions(['APPROVE_USER']),
  CommunityController.approveUserToJoinCommunity);
router.delete('/:community_id/reject-user/:user_id',
  AuthMiddleware(),
  checkRole(['SUPER_ADMIN', "ADMIN"]),
  checkPermissions(['REJECT_USER']),
  CommunityController.rejectUserToJoinCommunity);

router.delete('/:community_id/users/:user_id',
  AuthMiddleware(),
  checkRole(['SUPER_ADMIN', "ADMIN"]),
  checkPermissions(['REMOVE_USER_FROM_COMMUNITY']),
  CommunityController.removeUserFromCommunity);

router.put('/:community_id/users/:user_id/status',
  AuthMiddleware(),
  checkRole(['SUPER_ADMIN', 'ADMIN']),
  checkPermissions(['APPROVE_USER']),
  CommunityController.updateUserActiveStatus);

router.get('/:community_id/users',
  AuthMiddleware(),
  CommunityController.getCommunityUsers);

export default router;
