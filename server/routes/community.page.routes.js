import express from 'express';
import PageController from '../controllers/page.controller.js';
import { checkPermissions } from '../middlewares/checkPermissions.middleware.js';
import AuthMiddleware from '../middlewares/auth.middleware.js';
import checkRole from '../middlewares/role.middleware.js';

const router = express.Router();

// Page Management Routes within Community
router.get('/community-pages/pending-pages',
  AuthMiddleware(),
  checkRole(['SUPER_ADMIN', "ADMIN"]),
  PageController.getPendingPages);

router.get('/pages/search-pages',
  AuthMiddleware(),
  checkPermissions(['VIEW_PAGE', 'VIEW_COMMUNITY']),
  PageController.searchPages
);

router.get('/:community_id/pages',
  AuthMiddleware(),
  checkPermissions(['VIEW_PAGE', 'VIEW_COMMUNITY']),
  PageController.getCommunityPages);

router.post('/:community_id',
  AuthMiddleware(),
  checkPermissions(['CREATE_PAGE']),
  PageController.createPage);

router.put('/:community_id/:page_id',
  AuthMiddleware(),
  checkPermissions(['UPDATE_PAGE']),
  PageController.updatePage);

router.delete('/:community_id/:page_id',
  AuthMiddleware(),
  checkPermissions(['DELETE_PAGE']),
  PageController.deletePage);

router.get('/:community_id/:page_id',
  AuthMiddleware(),
  checkPermissions(['VIEW_PAGE']),
  PageController.getPageById);

router.post('/:community_id/approve/:page_id',
  AuthMiddleware(),
  checkRole(['SUPER_ADMIN', "ADMIN"]),
  checkPermissions(['APPROVE_PAGE']),
  PageController.approvePage);

router.post('/:community_id/reject/:page_id',
  AuthMiddleware(),
  checkRole(['SUPER_ADMIN', "ADMIN"]),
  checkPermissions(['REJECT_PAGE']),
  PageController.rejectPage);

export default router;
