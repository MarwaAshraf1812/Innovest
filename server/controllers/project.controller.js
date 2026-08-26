const ProjectService = require('../services/project.service');
const ProjectDTO = require('../common/dtos/project.dto');
const FileManagement = require('../services/file_management.service');
const Investment = require('../db/models/investmentModel');


const ProjectController = {
  /**
   * Create a new project and save it to the database
   * @param {Request} req - The request object
   * @param {Response} res - The response object
   * @returns {Promise<void>}
   */
  async addProject(req, res) {
    try {
      const { project_name, description, field, budget, deadline } = req.body;
      const userId = req.user.id;

      if (!project_name || !description || !field || !budget || !deadline) {
        return res.status(400).json({ message: "All fields are required." });
      }

      const uploadedPaths = [];
      if (req.files && req.files.length > 0) {
        for (const file of req.files) {
          const filePath = await FileManagement.save_file(file);
          uploadedPaths.push(filePath);
        }
      }

      const projectData = ProjectDTO.fromRequest({
        project_name,
        description,
        entrepreneur_id: userId,
        field,
        budget,
        deadline,
        status: 'under review',
        visibility: false,
        offer: req.body.offer || null,
        target: req.body.target || null,
        documents: uploadedPaths || [],
      });
      const project = await ProjectService.createProject(projectData);
      return res.status(201).json(ProjectDTO.toResponse(project, true));
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },

  /**
   * Updates a project with the given id.
   * @param {string} project_id - The id of the project to be updated.
   * @param {Object} updateData - The data to update the project with.
   * @returns {Promise<Object>} - The updated project.
   * @throws {Error} If the project couldn't be found.
   */
  async updateProject(req, res) {
    try {
      const { project_id } = req.params;
      const updateData = { ...req.body };
      delete updateData.entrepreneur_id;

      if (req.files && req.files.length > 0) {
        const uploadedPaths = [];
        for (const file of req.files) {
          const filePath = await FileManagement.save_file(file);
          uploadedPaths.push(filePath);
        }
        updateData.documents = uploadedPaths;
      }

      const project = await ProjectService.updateProject(project_id, updateData);
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }

      const isAuth = await ProjectService.isAuthorizedForDocuments(req.user, project);
      return res.status(200).json(ProjectDTO.toResponse(project, isAuth));
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },

  /**
   * Deletes a project with the given id.
   * @param {string} project_id - The id of the project to be deleted.
   * @returns {Promise<Object>} - The deleted project.
   * @throws {Error} If the project couldn't be found.
   */
  async deleteProject(req, res) {
    try {
      const { project_id } = req.params;
      console.log('controller', project_id);
      const project = await ProjectService.deleteProject(project_id);
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }
      return res.status(200).json({ message: 'Project deleted successfully' });
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' });
    }
  },

  /**
   * Protected endpoint for downloading a project document
   */
  async downloadProjectDocument(req, res) {
    try {
      const { project_id, filename } = req.params;
      const path = require('path');
      const project = await ProjectService.getProjectById(project_id);
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }

      const isAuth = await ProjectService.isAuthorizedForDocuments(req.user, project);
      if (!isAuth) {
        return res.status(403).json({ message: 'Unauthorized access to project documents' });
      }

      const cleanRequestedName = path.basename(filename);
      const projectDocNames = (project.documents || []).map(doc => path.basename(doc));

      if (projectDocNames.length > 0 && !projectDocNames.includes(cleanRequestedName)) {
        return res.status(404).json({ message: 'Document not found in project' });
      }

      const exists = await FileManagement.check_if_file_exist(cleanRequestedName);
      if (!exists) {
        return res.status(404).json({ message: 'File not found on server' });
      }

      const filePath = FileManagement.resolve_file_path(cleanRequestedName);
      return res.sendFile(filePath);
    } catch (error) {
      console.error('Error in downloadProjectDocument:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  },

  /**
   * Retrieves a project by its ID.
   * @param {Object} req - The HTTP request object.
   * @param {Object} res - The HTTP response object.
   * @returns {Promise<void>} - Responds with a project document or an error message.
   * @throws {Error} If the project couldn't be found.
   */
  async getProject(req, res) {
    try {
      const { project_id } = req.params;
      const project = await ProjectService.getProjectById(project_id);
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }
      const isAuth = await ProjectService.isAuthorizedForDocuments(req.user, project);
      return res.status(200).json(ProjectDTO.toResponse(project, isAuth));
    } catch (error) {
      console.error('Error in getProject:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  },

  /**
   * Retrieves all projects.
   * @param {Object} req - The HTTP request object.
   * @param {Object} res - The HTTP response object.
   * @returns {Promise<void>} - Responds with a list of projects or an error message.
   * @throws {Error} If the projects couldn't be fetched.
   */
  async getProjects(req, res) {
    try {
      const pagination = JSON.parse(req.query.pagination || '{}');
      const result = await ProjectService.getAllProjects(pagination);
      
      if (result.projects.length === 0) {
        return res.status(404).json({ message: 'No projects found' });
      }
      
      const formattedProjects = await Promise.all(
        result.projects.map(async (p) => {
          const isAuth = await ProjectService.isAuthorizedForDocuments(req.user, p);
          return ProjectDTO.toResponse(p, isAuth);
        })
      );

      return res.status(200).json({
        ...result,
        projects: formattedProjects
      });
    } catch (error) {
      console.error('Error in getProjects:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  },

/**
 * Retrieves all projects for a specific user by user ID.
 * @param {Object} req - The HTTP request object containing the user ID in the params.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} - Responds with a list of projects for the user or an error message.
 * @throws {Error} If there is an issue retrieving the projects.
 */
  async getUserProjects(req, res) {
    try {
      const { user_id } = req.params;
      const projects = await ProjectService.getProjectsForUser(user_id);
      if (!projects || projects.length === 0) {
        return res.status(404).json({ message: 'No projects found for this user' });
      }
      
      const formattedProjects = await Promise.all(
        projects.map(async (p) => {
          const isAuth = await ProjectService.isAuthorizedForDocuments(req.user, p);
          return ProjectDTO.toResponse(p, isAuth);
        })
      );

      return res.status(200).json(formattedProjects);
    } catch (error) {
      console.error('Error in getUserProjects:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  },

  /**
   * Retrieves all projects that contain a specific field.
   * @param {Object} req - The HTTP request object containing the field in the query.
   * @param {Object} res - The HTTP response object.
   * @returns {Promise<void>} - Responds with a list of projects containing the given field or an error message.
   * @throws {Error} If there is an issue retrieving the projects.
   */
  async getProjectsByField(req, res) {
    try {
      const { field } = req.query;
      if (!field) {
        return res.status(400).json({ message: 'Field parameter is required' });
      }
  
      const projects = await ProjectService.getProjectsByField(field);
      if (!projects || projects.length === 0) {
        return res.status(404).json({ message: 'No projects found' });
      }
  
      const formattedProjects = await Promise.all(
        projects.map(async (p) => {
          const isAuth = await ProjectService.isAuthorizedForDocuments(req.user, p);
          return ProjectDTO.toResponse(p, isAuth);
        })
      );

      return res.status(200).json(formattedProjects);
    } catch (error) {
      console.error('Error in getProjectsByField:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  },

  /**
   * Retrieves all projects that are under review.
   * @param {Object} req - The HTTP request object.
   * @param {Object} res - The HTTP response object.
   * @returns {Promise<void>} - Responds with a list of projects that are under review or an error message.
   * @throws {Error} If there is an issue retrieving the projects.
   */
  async getUnderReviewProjects(req, res) {
    try {
      const underReviewProjects = await ProjectService.getUnderReviewProjects();
      if (!underReviewProjects) {
        return res.status(404).json({ message: 'No projects found' });
      }

      return res.status(200).json(underReviewProjects.map(p => ProjectDTO.toResponse(p, true)));
    } catch (error) {
      console.error('Error in getUnderReviewProjects:', error);
      return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  },

  /**
   * Approves a project.
   * @param {Object} req - The HTTP request object containing the project ID in the params.
   * @param {Object} res - The HTTP response object.
   * @returns {Promise<void>} - Responds with a success message and the approved project, or an error message.
   * @throws {Error} If there is an issue approving the project.
   */
  async approveProject(req, res) {
    try {
      const { project_id } = req.params;
      const approvedProject = await ProjectService.approveProject(project_id);
      if (!approvedProject) {
        return res.status(404).json({ message: 'Project not found' });
      }
      
      try {
        const NotificationService = require('../services/notification.service');
        await NotificationService.notifyUser(approvedProject.entrepreneur_id, 'pitchApproved', {
          project_id: approvedProject.project_id,
          project_name: approvedProject.project_name,
          message: `Your pitch "${approvedProject.project_name}" has been approved by the platform admins.`
        });
      } catch (err) {
        console.error("Failed to notify entrepreneur about pitch approval:", err);
      }

      return res.status(200).json({ message: 'Project approved successfully', project: approvedProject });
    } catch (error) {
      console.error('Error in approveProject:', error);
      return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  },

  /**
   * Rejects a project by its ID.
   * @param {Object} req - The HTTP request object containing the project ID in the params.
   * @param {Object} res - The HTTP response object.
   * @returns {Promise<void>} - Responds with a success message and the rejected project, or an error message.
   * @throws {Error} If there is an issue rejecting the project.
   */
  async rejectProject(req, res) {
    try {
      const { project_id } = req.params;
      const rejectedProject = await ProjectService.rejectProject(project_id);
      if (!rejectedProject) {
        return res.status(404).json({ message: 'Project not found' });
      }

      try {
        const NotificationService = require('../services/notification.service');
        await NotificationService.notifyUser(rejectedProject.entrepreneur_id, 'pitchRejected', {
          project_id: rejectedProject.project_id,
          project_name: rejectedProject.project_name,
          message: `Your pitch "${rejectedProject.project_name}" has been rejected by the platform admins.`
        });
      } catch (err) {
        console.error("Failed to notify entrepreneur about pitch rejection:", err);
      }

      return res.status(200).json({ message: 'Project rejected successfully', project: rejectedProject });
    } catch (error) {
      console.error('Error in rejectProject:', error);
      return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  },

  /**
   * Records an investor's expression of interest on an approved project.
   * Creates an Investment record tied to investor + project.
   * @route POST /api/project/:project_id/interest
   */
  async expressInterest(req, res) {
    try {
      const { project_id } = req.params;
      const investorId = req.user.id;

      const project = await ProjectService.getProjectById(project_id);
      if (!project) return res.status(404).json({ message: 'Project not found' });
      if (project.approved !== 'approved') {
        return res.status(400).json({ message: 'You can only express interest in approved projects.' });
      }

      // Find the Mongoose ObjectId of the investor
      const { User } = require('../db/models/userModel');
      const investorUser = await User.findOne({ id: investorId });
      if (!investorUser) return res.status(404).json({ message: 'Investor user not found' });

      // Prevent duplicate expressions of interest
      const existing = await Investment.findOne({ investor_id: investorUser._id, project_id: project._id });
      if (existing) {
        return res.status(409).json({ message: 'You have already expressed interest in this project.' });
      }

      const investment = new Investment({
        proposal_id: project._id,
        investor_id: investorUser._id,
        project_id: project._id,
        amount_invested: 0,
        payment_status: 'pending',
      });
      await investment.save();

      // Notify the entrepreneur about investor's interest
      try {
        const NotificationService = require('../services/notification.service');
        const investorName = `${investorUser.first_name || ''} ${investorUser.last_name || ''}`.trim() || investorUser.username;

        await NotificationService.notifyUser(project.entrepreneur_id, 'expressionOfInterest', {
          project_id: project.project_id,
          project_name: project.project_name,
          investor_id: investorId,
          message: `${investorName} has expressed interest in your pitch "${project.project_name}".`
        });
      } catch (err) {
        console.error("Failed to notify entrepreneur about expression of interest:", err);
      }

      return res.status(201).json({ message: 'Expression of interest submitted successfully.', investment });
    } catch (error) {
      console.error('Error in expressInterest:', error);
      return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  },

  /**
   * Returns all projects an investor has expressed interest in.
   * @route GET /api/project/investor/my-interests
   */
  async getMyInterests(req, res) {
    try {
      const investorId = req.user.id;
      const { User } = require('../db/models/userModel');
      const investorUser = await User.findOne({ id: investorId });
      if (!investorUser) return res.status(404).json({ message: 'Investor user not found' });

      const investments = await Investment.find({ investor_id: investorUser._id })
        .populate({ path: 'project_id', model: 'Project' })
        .lean();

      const result = investments.map(inv => ({
        investment_id: inv._id,
        amount_invested: inv.amount_invested,
        payment_status: inv.payment_status,
        transaction_date: inv.transaction_date,
        project: inv.project_id,
      }));

      return res.status(200).json(result);
    } catch (error) {
      console.error('Error in getMyInterests:', error);
      return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  }
};

module.exports = ProjectController;
