const express = require('express');
const PageController = require('../controllers/page.controller');
const { checkPermissions } = require('../middlewares/checkPermissions.middleware');
const AuthMiddleware = require('../middlewares/auth.middleware');
const checkRole = require('../middlewares/role.middleware');
const pageController = require('../controllers/page.controller');
const router = express.Router();

// Page Management Routes within Community
router.get('/community-pages/pending-pages',
  AuthMiddleware(),
  checkRole(['SUPER_ADMIN', "ADMIN"]),
  pageController.getPendingPages);

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





module.exports = router;
