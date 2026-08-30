import ProjectDAO from '../common/daos/project.dao.js';
import FileManagement from './file_management.service.js';
import path from 'path';
import Proposal from '../db/models/proposalModel.js';
import Investment from '../db/models/investmentModel.js';
import { User } from '../db/models/userModel.js';

const ProjectService = {

  /**
   * Creates a new project
   * @param {Object} projectData - Data for the project to be created
   * @param {string} userId - The ID of the user creating the project
   * @returns {Promise<Project>} - The newly created project
   */
  async createProject(projectData, userId) {
    return await ProjectDAO.createProject(projectData, userId);
  },

  /**
   * Updates a project with the given id with the provided data
   * @param {string} projectId - The id of the project to be updated
   * @param {Object} updateData - The data to update the project with
   * @returns {Promise<Project>} - The updated project
   * @throws {Error} If the project couldn't be found
   */
  async updateProject(projectId, updateData) {
    const existingProject = await ProjectDAO.getProjectById(projectId);
    const project = await ProjectDAO.updateProject(projectId, updateData);
    if (!project) {
      throw new Error('Project not found');
    }
    if (existingProject && existingProject.documents && updateData.documents) {
      const newDocs = new Set(updateData.documents.map(d => path.basename(d)));
      for (const oldDoc of existingProject.documents) {
        const cleanOld = path.basename(oldDoc);
        if (!newDocs.has(cleanOld)) {
          await FileManagement.delete_file(cleanOld);
        }
      }
    }
    return project;
  },

  /**
   * Deletes a project with the given id.
   * @param {string} projectId - The id of the project to be deleted.
   * @returns {Promise<Project>} - The deleted project.
   * @throws {Error} If the project couldn't be found.
   */
  async deleteProject(projectId) {
    const project = await ProjectDAO.deleteProject(projectId);
    if (!project) {
      throw new Error('Project not found');
    }
    if (project.documents && project.documents.length > 0) {
      for (const doc of project.documents) {
        await FileManagement.delete_file(doc);
      }
    }
    return project;
  },

  /**
   * Retrieves a project by its ID
   * @param {string} projectId - The ID of the project to retrieve
   * @returns {Promise<Project>} - The project document if found
   * @throws {Error} If the project couldn't be found
   */
  async getProjectById(projectId) {
    const project = await ProjectDAO.getProjectById(projectId);
    if (!project) {
      throw new Error('Project not found');
    }
    return project;
  },

  /**
   * Retrieves all projects.
   * @returns {Promise<Project[]>} - A list of all projects.
   * @throws {Error} If the projects couldn't be fetched.
   */
  async getAllProjects(pagination) {
    return await ProjectDAO.getAllProjects(pagination);
  },

  /**
   * Retrieves all projects for a user.
   * @param {string} userId - The ID of the user to retrieve projects for.
   * @returns {Promise<Project[]>} - A list of all projects for the user.
   * @throws {Error} If the projects couldn't be fetched.
   */
  async getProjectsForUser(userId) {
    return await ProjectDAO.getUserProjects(userId);
  },

  /**
   * Retrieves all projects that contain a specific field.
   * @param {string} field - The name of the field to search for.
   * @returns {Promise<Project[]>} - A list of projects containing the given field.
   * @throws {Error} If an error occurs while fetching the projects.
   */
  async getProjectsByField(field) {
    return await ProjectDAO.getProjectsByField(field);
  },

  /**
   * Retrieves all projects that are under review.
   * @returns {Promise<Project[]>} - A list of projects with 'pending' approval status.
   * @throws {Error} If an error occurs while fetching the projects.
   */
  async getUnderReviewProjects() {
    return await ProjectDAO.getUnderReviewProjects();
  },

  /**
   * Approves a project by updating its approval status to 'approved'.
   * @param {string} projectId - The ID of the project to be approved.
   * @returns {Promise<Project>} - The approved project document.
   * @throws {Error} - If an error occurs while approving the project.
   */
  async approveProject(projectId) {
    return await ProjectDAO.approveProject(projectId);
  },

  /**
   * Rejects a project by updating its approval status to 'rejected'.
   * @param {string} projectId - The ID of the project to be rejected.
   * @returns {Promise<Project>} - The rejected project document.
   * @throws {Error} - If an error occurs while rejecting the project.
   */
  async rejectProject(projectId) {
    return await ProjectDAO.rejectProject(projectId);
  },

  /**
   * Checks whether a user is authorized to access a project's pitch deck / documents.
   * Authorized users: Project owner (Entrepreneur), Platform Admins, or Investors with active proposals / interest.
   * @param {Object} user - Authenticated user object from req.user
   * @param {Object} project - Mongoose project document
   * @returns {Promise<boolean>}
   */
  async isAuthorizedForDocuments(user, project) {
    if (!user || !project) return false;

    // 1. Admin access
    if (['ADMIN', 'SUPER_ADMIN'].includes(user.role)) {
      return true;
    }

    // 2. Project owner access
    if (project.entrepreneur_id === user.id) {
      return true;
    }

    // 3. Investor access (active/accepted proposal OR expression of interest)
    if (user.role === 'INVESTOR') {
      const proposal = await Proposal.findOne({
        project_id: project.project_id,
        investor_id: user.id,
        status: { $in: ['pending', 'countered', 'accepted'] }
      });
      if (proposal) return true;

      const investorUser = await User.findOne({ id: user.id });
      if (investorUser) {
        const investment = await Investment.findOne({
          project_id: project._id,
          investor_id: investorUser._id
        });
        if (investment) return true;
      }
    }

    return false;
  }
};

export default ProjectService;