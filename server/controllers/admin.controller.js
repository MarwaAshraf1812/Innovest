const AdminService = require('../services/admin.service');
const { CreateAdminDTO } = require('../common/dtos/admin.dto');
const adminValidationSchema = require('../db/validators/adminValidator');

/**
 * AdminController class handles HTTP requests related to admin user management.
 * It interacts with the AdminService to perform CRUD operations on admin users.
 */
class AdminController {
  /**
   * Creates a new admin user based on the request body.
   * Validates the input data and returns the created admin user.
   * @param {Object} req - The HTTP request object.
   * @param {Object} res - The HTTP response object.
   * @returns {Promise<void>} - Responds with the created admin user or an error message.
   */
  async create(req, res) {
    try {
      const { error } = adminValidationSchema.validate(req.body);
      if (error) {
        return res.status(400).send({ message: error.details[0].message });
      }
      const adminDto = new CreateAdminDTO(req.body);
      const admin = await AdminService.createAdmin(adminDto);
      res.status(201).json(admin);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  /**
   * Updates an existing admin user identified by the given ID.
   * @param {Object} req - The HTTP request object containing the admin ID in the params and update data in the body.
   * @param {Object} res - The HTTP response object.
   * @returns {Promise<void>} - Responds with the updated admin user or an error message.
   */
  async update(req, res) {
    try {
      const updatedAdmin = await AdminService.updateAdmin(req.params.id, req.body);
      if (!updatedAdmin) return res.status(404).json({ message: 'Admin not found' });
      res.status(200).json({
        message: 'Admin updated',
        admin: updatedAdmin,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  /**
   * Deletes an admin user identified by the given ID.
   * @param {Object} req - The HTTP request object containing the admin ID in the params.
   * @param {Object} res - The HTTP response object.
   * @returns {Promise<void>} - Responds with a 204 status code if successful or an error message.
   */
  async delete(req, res) {
    try {
      const deletedAdmin = await AdminService.deleteAdmin(req.params.id);
      if (!deletedAdmin) return res.status(404).json({ message: 'Admin not found' });
      res.status(200).json({ message: 'Admin Deleted', deletedAdmin });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  /**
   * Retrieves a list of all admin users.
   * @param {Object} req - The HTTP request object.
   * @param {Object} res - The HTTP response object.
   * @returns {Promise<void>} - Responds with a list of admin users or an error message.
   */
  async list(req, res) {
    try {
      const admins = await AdminService.getAllAdmins();
      res.status(200).json(admins);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  /**
   * Retrieves an admin user identified by the given ID.
   * @param {Object} req - The HTTP request object containing the admin ID in the params.
   * @param {Object} res - The HTTP response object.
   * @returns {Promise<void>} - Responds with the admin user or an error message.
   */
  async getById(req, res) {
    try {
      const admin = await AdminService.getAdminByID(req.params.id);
      if (!admin) return res.status(404).json({ message: 'Admin not found' });
      res.status(200).json(admin);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  /**
  * Handles the search request for admins by username.
  * @param {Object} req - The request object containing the query parameter `usernameQuery`.
  * @param {Object} res - The response object.
  */
  async searchAdmins(req, res) {
    const { usernameQuery } = req.query;
    console.log(usernameQuery)

    try {
      if (!usernameQuery) {
        return res.status(400).json({ error: 'Username query is required' });
      }

      const admins = await AdminService.searchAdminsByUsername(usernameQuery);
      if (!admins.length) {
        return res.status(404).json({ error: 'No admins found with the given username' });
      }
      res.status(200).json(admins);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new AdminController();
