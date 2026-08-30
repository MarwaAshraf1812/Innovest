import express from 'express';
import Joi from 'joi';
import AdminController from '../controllers/admin.controller.js';
import checkRole from '../middlewares/role.middleware.js';
import AdminAuthController from '../controllers/admin_auth.controller.js';
import { checkPermissions } from '../middlewares/checkPermissions.middleware.js';
import AuthMiddleware from '../middlewares/auth.middleware.js';
import { checkOwnership } from '../middlewares/checkOwnership.middleware.js';
import validatePayload from '../middlewares/validatePayload.middleware.js';
import { authLimiter } from '../middlewares/rateLimiter.middleware.js';
import adminValidationSchema from '../db/validators/adminValidator.js';
import Admin from '../db/models/adminModel.js';

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

export default router;
