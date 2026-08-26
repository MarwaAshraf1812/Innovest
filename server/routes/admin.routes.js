const express = require('express');
const Joi = require('joi');
const AdminController = require('../controllers/admin.controller');
const checkRole = require('../middlewares/role.middleware');
const AdminAuthController = require('../controllers/admin_auth.controller');
const { checkPermissions } = require('../middlewares/checkPermissions.middleware');
const AuthMiddleware = require('../middlewares/auth.middleware');
const { checkOwnership } = require('../middlewares/checkOwnership.middleware');
const validatePayload = require('../middlewares/validatePayload.middleware');
const { authLimiter } = require('../middlewares/rateLimiter.middleware');
const adminValidationSchema = require('../db/validators/adminValidator');
const Admin = require('../db/models/adminModel');

const router = express.Router();

const adminLoginSchema = Joi.object({
  username_or_email: Joi.string().optional(),
  email: Joi.string().optional(),
  username: Joi.string().optional(),
  password: Joi.string().required(),
}).or('username_or_email', 'email', 'username');

// Auth Endpoints
router.post('/register', authLimiter, validatePayload(adminValidationSchema), AdminAuthController.register);
router.post('/login', authLimiter, validatePayload(adminLoginSchema), AdminAuthController.login);
router.get('/logout', AdminAuthController.logout);

// Admin Management Operations
router.get('/search',
  AuthMiddleware(),
  checkRole(['SUPER_ADMIN', "ADMIN"]),
  AdminController.searchAdmins);

router.post('/',
  AuthMiddleware(),
  checkRole(['SUPER_ADMIN']),
  validatePayload(adminValidationSchema),
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
