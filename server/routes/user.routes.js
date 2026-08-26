const express = require('express');
const Joi = require('joi');
const UserAuthController = require('../controllers/user_auth.controller');
const UserController = require('../controllers/user.controller');
const { checkPermissions } = require('../middlewares/checkPermissions.middleware');
const AuthMiddleware = require('../middlewares/auth.middleware');
const checkRole = require('../middlewares/role.middleware');
const validatePayload = require('../middlewares/validatePayload.middleware');
const { authLimiter } = require('../middlewares/rateLimiter.middleware');
const { createUserValidationSchema } = require('../db/validators/userValidations/createUser.validator');
const { updateUserValidationSchema } = require('../db/validators/userValidations/updateUser.validator');

const router = express.Router();
var multer = require('multer');
var multParse = multer();

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

module.exports = router;