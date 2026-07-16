const express = require('express');
const AdminController = require('../controllers/admin.controller');
const checkRole = require('../middlewares/role.middleware');
const AdminAuthController = require('../controllers/admin_auth.controller');
const { checkPermissions } = require('../middlewares/checkPermissions.middleware');
const AuthMiddleware = require('../middlewares/auth.middleware');
const { checkOwnership } = require('../middlewares/checkOwnership.middleware');
const Admin = require('../db/models/adminModel');
const router = express.Router();

// Auth Endpoints
router.post('/register', AdminAuthController.register);
router.post('/login', AdminAuthController.login);
router.get('/logout', AdminAuthController.logout);

// Admin Management Operations
router.get('/search',
  AuthMiddleware(),
  checkRole(['SUPER_ADMIN', "ADMIN"]),
  AdminController.searchAdmins);

router.post('/',
  AuthMiddleware(),
  checkRole(['SUPER_ADMIN']),
  AdminController.create);

router.put('/:id',
  AuthMiddleware(),
  checkRole(['SUPER_ADMIN', "ADMIN"]),
  checkOwnership(Admin, 'admin_id'),
  checkPermissions(['UPDATE_USER_OR_ADMIN']),
  AdminController.update);

router.delete('/:id',
  AuthMiddleware(),
  checkRole(['SUPER_ADMIN', "ADMIN"]),
  checkOwnership(Admin, 'admin_id'),
  checkPermissions(['DELETE_USER_OR_ADMIN']),
  AdminController.delete);

router.get('/',
  AuthMiddleware(),
  checkRole(['SUPER_ADMIN', "ADMIN"]),
  AdminController.list);

router.get('/:id',
  AuthMiddleware(),
  checkRole(['SUPER_ADMIN', 'ADMIN']),
  AdminController.getById);

module.exports = router;
