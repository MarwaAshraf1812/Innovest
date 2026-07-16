const express = require('express');
const ProjectController = require('../controllers/project.controller');
const AuthMiddleware = require('../middlewares/auth.middleware');
const checkRole = require('../middlewares/role.middleware');
var multer = require('multer');
const router = express.Router();

const storage = multer.memoryStorage();
const multParse = multer({ storage: storage });

// Get all projects by field
router.get('/fields',
  AuthMiddleware(),
  ProjectController.getProjectsByField);

// Add a new project
router.post('/',
  multParse.any(), 
  AuthMiddleware(),
  ProjectController.addProject);

// Update a project
router.put('/:project_id',
  AuthMiddleware(),
  ProjectController.updateProject);

// Delete a project
router.delete('/:project_id',
  AuthMiddleware(),
  ProjectController.deleteProject);

// Get all projects
router.get('/',
  AuthMiddleware(),
  ProjectController.getProjects);

// Get a project
router.get('/:project_id',
  AuthMiddleware(),
  ProjectController.getProject);

// Get all projects for a user
router.get('/user/:user_id',
  AuthMiddleware(),
  ProjectController.getUserProjects);

// Get all under review projects
router.get('/status/under-review',
  AuthMiddleware(),
  checkRole(['SUPER_ADMIN', "ADMIN"]),
  ProjectController.getUnderReviewProjects);

// Approve a project
router.put('/approve/:project_id',
  AuthMiddleware(),
  checkRole(['SUPER_ADMIN', "ADMIN"]),
  ProjectController.approveProject);

// Reject a project
router.put('/reject/:project_id',
  AuthMiddleware(),
  checkRole(['SUPER_ADMIN', "ADMIN"]),
  ProjectController.rejectProject);

// Investor: get all projects I've expressed interest in
router.get('/investor/my-interests',
  AuthMiddleware(),
  checkRole(['INVESTOR']),
  ProjectController.getMyInterests);

// Investor: express interest in a specific approved project
router.post('/:project_id/interest',
  AuthMiddleware(),
  checkRole(['INVESTOR']),
  ProjectController.expressInterest);


module.exports = router;