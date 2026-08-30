import express from 'express';
import Joi from 'joi';
import UserAuthController from '../controllers/user_auth.controller.js';
import UserController from '../controllers/user.controller.js';
import { checkPermissions } from '../middlewares/checkPermissions.middleware.js';
import AuthMiddleware from '../middlewares/auth.middleware.js';
import checkRole from '../middlewares/role.middleware.js';
import validatePayload from '../middlewares/validatePayload.middleware.js';
import { authLimiter } from '../middlewares/rateLimiter.middleware.js';
import { createUserValidationSchema } from '../db/validators/userValidations/createUser.validator.js';
import { updateUserValidationSchema } from '../db/validators/userValidations/updateUser.validator.js';
import multer from 'multer';

const router = express.Router();
const multParse = multer();

const loginValidationSchema = Joi.object({
  username_or_email: Joi.string().optional(),
  email: Joi.string().optional(),
  username: Joi.string().optional(),
  password: Joi.string().required(),
}).or('username_or_email', 'email', 'username');

router.post('/register', authLimiter, multParse.any(), validatePayload(createUserValidationSchema), UserAuthController.register);
router.post('/login', authLimiter, validatePayload(loginValidationSchema), UserAuthController.login);
router.post('/refresh-token', UserAuthController.refreshToken);
router.get('/logout', UserAuthController.logout);
router.get('/verify',
  AuthMiddleware(),
  UserAuthController.verify);
router.get('/pending-users',
  AuthMiddleware(),
  UserAuthController.getPendingUsers);
router.put('/approve-user/:user_id',
  AuthMiddleware(),
  UserAuthController.approveUser
);

router.put('/reject-user/:user_id',
  AuthMiddleware(),
  UserAuthController.rejectUser);

router.post('/forgot-password',
  AuthMiddleware(),
  UserAuthController.forgotPassword);

router.post('/reset-password',
  UserAuthController.resetPassword);

// User Management Operations
router.get('/search',
  AuthMiddleware(),
  checkRole(['SUPER_ADMIN', "ADMIN", 'ENTREPRENEUR', 'INVESTOR']),
  checkPermissions(['VIEW_USER']),
  UserController.searchUsers);

// Investor directory (all verified investors)
router.get('/investors',
  AuthMiddleware(),
  UserController.getInvestors);

// Dashboard stats for the currently logged-in user
router.get('/me/stats',
  AuthMiddleware(),
  UserController.getUserStats);

// User Notifications
router.get('/notifications',
  AuthMiddleware(),
  UserController.getNotifications);

router.put('/notifications/mark-all-read',
  AuthMiddleware(),
  UserController.markAllNotificationsAsRead);

router.put('/notifications/:notification_id/read',
  AuthMiddleware(),
  UserController.markNotificationAsRead);

router.get('/',
  AuthMiddleware(),
  checkRole(['SUPER_ADMIN', "ADMIN", 'ENTREPRENEUR', 'INVESTOR']),
  checkPermissions(['VIEW_USER']),
  UserController.getUsers);

router.get('/:id',
  AuthMiddleware(),
  checkRole(['SUPER_ADMIN', "ADMIN", 'ENTREPRENEUR', 'INVESTOR']),
  checkPermissions(['VIEW_USER']),
  UserController.getUserById);

router.delete('/:id',
  AuthMiddleware(),
  checkRole(['SUPER_ADMIN', "ADMIN", 'ENTREPRENEUR', 'INVESTOR']),
  checkPermissions(['DELETE_USER']),
  UserController.deleteUser);

router.put('/:id',
  AuthMiddleware(),
  checkRole(['SUPER_ADMIN', "ADMIN", 'ENTREPRENEUR', 'INVESTOR']),
  checkPermissions(['UPDATE_USER']),
  validatePayload(updateUserValidationSchema),
  UserController.updateUser);

export default router;