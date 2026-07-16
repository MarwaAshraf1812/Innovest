const ProjectDAO = require('../common/daos/project.dao');


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
    const project = await ProjectDAO.updateProject(projectId, updateData);
    if (!project) {
      throw new Error('Project not found');
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
  }
};

module.exports = ProjectService;