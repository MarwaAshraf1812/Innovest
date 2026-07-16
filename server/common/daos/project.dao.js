const Project = require('../../db/models/projectModel');
const { User } = require('../../db/models/userModel');

const ProjectDAO = {
  /**
   * Creates a new project in the database and adds it to the associated user's projects list
   * @param {Object} projectData - The data for the project to be created
   * @returns {Promise<Project>} - The newly created project
   * @throws {Error} If the project couldn't be created
   */
  async createProject(projectData) {
    try {
      const newProject = new Project({ ...projectData });
      const savedProject = await newProject.save();

      await User.findOneAndUpdate(
        { id: newProject.entrepreneur_id },
        { $addToSet: { projects: savedProject.project_id } },
        { new: true },
      );

      return savedProject;
    } catch (error) {
      throw new Error('Error creating project: ' + error.message);
    }
  },

  /**
   * Updates a project with the given id.
   * @param {string} projectId - The id of the project to be updated.
   * @param {Object} updateData - The data to update the project with.
   * @returns {Promise<Project>} - The updated project.
   * @throws {Error} If the project couldn't be found.
   */
  async updateProject(projectId, updateData) {
    try {
      const project = await Project.findOneAndUpdate(
        { project_id: projectId },
        { $set: updateData },
        { new: true, runValidators: true },
      );

      if (!project) throw new Error('Project not found for update');
      return project;
    } catch (error) {
      throw new Error('Error updating project in dao: ' + error.message);
    }
  },

  /**
   * Deletes a project by its ID.
   * @param {string} projectId - The ID of the project to be deleted.
   * @returns {Promise<Project>} - The deleted project document.
   * @throws {Error} If the project or the associated user couldn't be found.
   */
  async deleteProject(projectId) {
    try {
      const project = await Project.findOneAndDelete({ project_id: projectId });
      if (!project) throw new Error('Project not found for deletion');

      const user = await User.findOneAndUpdate(
        { projects: project.project_id },
        { $pull: { projects: project.project_id } },
        { new: true },
      );

      if (!user) throw new Error('User not found for deletion');

      return project;
    } catch (error) {
      throw new Error('Error deleting project in dao: ' + error.message);
    }
  },

  /**
   * Retrieves a project by its ID.
   * @param {string} projectId - The ID of the project to retrieve.
   * @returns {Promise<Project>} - The project document if found.
   * @throws {Error} - If the project couldn't be found.
   */
  async getProjectById(projectId) {
    try {
      const project = await Project.findOne({ project_id: projectId });
      if (!project) throw new Error('Project not found');
      return project;
    } catch (error) {
      throw new Error('Error getting project in dao: ' + error.message);
    }
  },

  /**
   * Retrieves all projects with pagination.
   * @param {Object} [pagination] - Optional pagination object with page and limit properties.
   * @param {Number} [pagination.page=1] - Page number for pagination.
   * @param {Number} [pagination.limit=10] - Number of items to return per page.
   * @returns {Promise<Object>} - An object containing the total items count, current page, total pages, and an array of projects.
   * @throws {Error} - If an error occurs while retrieving projects.
   */
  async getAllProjects(pagination = {}) {
    try {
      const { page = 1, limit = 10 } = pagination;
      const skip = (page - 1) * limit;

      const totalItems = await Project.countDocuments();
      const projects = await Project.find().skip(skip).limit(limit);

      return {
        totalItems,
        currentPage: page,
        totalPages: Math.ceil(totalItems / limit),
        projects,
      };
    } catch (error) {
      throw new Error('Error getting all projects in dao: ' + error.message);
    }
  },

  /**
   * Retrieves all projects associated with a specific entrepreneur.
   * @param {string} entrepreneurId - The ID of the entrepreneur whose projects are to be retrieved.
   * @returns {Promise<Project[]>} - A list of projects associated with the entrepreneur.
   * @throws {Error} If an error occurs while fetching the projects.
   */

  async getUserProjects(entrepreneurId) {
    try {
      const projects = await Project.find({ entrepreneur_id: entrepreneurId });

      return projects;
    } catch (error) {
      throw new Error(
        'Error getting projects by entrepreneur in dao: ' + error.message,
      );
    }
  },

  /**
   * Retrieves all projects that contain a specific field.
   * @param {string} field - The name of the field to search for.
   * @returns {Promise<Project[]>} - A list of projects containing the given field.
   * @throws {Error} If an error occurs while fetching the projects.
   */
  async getProjectsByField(field) {
    try {
      const projects = await Project.find({ field: field });
      return projects;
    } catch (error) {
      throw new Error(
        'Error getting projects by field in dao: ' + error.message,
      );
    }
  },

  /**
   * Retrieves all projects that are under review.
   * @returns {Promise<Project[]>} - A list of projects with 'pending' approval status.
   * @throws {Error} If an error occurs while fetching the projects.
   */
  async getUnderReviewProjects() {
    try {
      const projects = await Project.find({ approved: 'pending' });
      return projects;
    } catch (error) {
      throw new Error(
        'Error getting projects by status in dao: ' + error.message,
      );
    }
  },

/**
 * Approves a project by updating its approval status to 'approved'.
 * @param {string} projectId - The ID of the project to be approved.
 * @returns {Promise<Project>} - The approved project document.
 * @throws {Error} - If an error occurs while approving the project.
 */
  async approveProject(projectId) {
    try {
      const project = await Project.findOneAndUpdate(
        { project_id: projectId },
        { $set: { approved: 'approved' } },
        { new: true },
      );
      return project;
    } catch (error) {
      throw new Error('Error approving project in dao: ' + error.message);
    }
  },

/**
 * Rejects a project by updating its approval status to 'rejected'.
 * @param {string} projectId - The ID of the project to be rejected.
 * @returns {Promise<Project>} - The updated project document with the 'rejected' status.
 * @throws {Error} If an error occurs during the rejection process.
 */
  async rejectProject(projectId) {
    try {
      const project = await Project.findOneAndUpdate(
        { project_id: projectId },
        { $set: { approved: 'rejected' } },
        { new: true },
      )
      return project;
    } catch (error) {
      throw new Error('Error rejecting project in dao: ' + error.message);
    }
  }
};

module.exports = ProjectDAO;
