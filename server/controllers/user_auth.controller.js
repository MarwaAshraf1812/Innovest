const UserService = require('../services/user_auth.service');
const RegisterUserDTO = require('../common/dtos/auth/register_user.dto');
const LoginDTO = require('../common/dtos/auth/login.dto');
const { User } = require('../db/models/userModel');
const Admin = require('../db/models/adminModel');
const notificationService = require('../services/notification.service');
class UserController {
  /**
   * Registers a new user.
   * @param {Object} req - The HTTP request object containing the user data in the body.
   * @param {Object} res - The HTTP response object.
   * @returns {Promise<void>} - Responds with the registered user object or an error message.
   */
  async register(req, res) {
    const registerUserDTO = new RegisterUserDTO(req.body);
    try {
      const token = await UserService.register(registerUserDTO, req.files);
      const admins = await Admin.find();

      await Promise.all(
        admins.map(async (admin) => {
          try {
            await notificationService.notifyAdmin(admin.admin_id, 'newRegister', {});
          } catch (error) {
            console.error(`Failed to notify admin with ID: ${admin.admin_id}`, error);
          }
        })
      );


      const isProd = process.env.NODE_ENV === 'production';
      res
        .status(201)
        .cookie('token', token, { 
            httpOnly: true, 
            sameSite: isProd ? 'none' : 'lax', 
            secure: isProd 
        })
        .json({ message: 'Registration successful' });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  /**
   * Logs in an existing user with the given username or email and password.
   * @param {Object} req - The HTTP request object containing the username or email and password in the body.
   * @param {Object} res - The HTTP response object.
   * @returns {Promise<void>} - Responds with a JWT token for the user in a cookie or an error message.
   * @throws {Error} If the user does not exist or if the password is invalid.
   */
  async login(req, res) {
    const { username_or_email, password } = req.body;
    const loginDTO = new LoginDTO(username_or_email, password);
    const user = await User.findOne({
      $or: [
        { email: username_or_email },
        { username: username_or_email }
      ]
    })
    if (!user) {
      return res.status(404).json({ message: 'User not Found' });
    }
    console.log(user);
    const validationError = loginDTO.isValid();
    if (validationError) {
      return res.status(400).json({ message: 'Invalid login data' });
    }
    try {
      const token = await UserService.login(username_or_email, password);
      const admins = await Admin.find();
      await Promise.all(
        admins.map(async (admin) => {
          try {
            await notificationService.notifyAdmin(admin.admin_id, 'newLogin', {});
          } catch (error) {
            console.error(`Failed to notify admin with ID: ${admin.admin_id}`, error);
          }
        })
      );
      const isProd = process.env.NODE_ENV === 'production';
      res
        .status(200)
        .cookie('token', token, { 
            httpOnly: true, 
            sameSite: isProd ? 'none' : 'lax', 
            secure: isProd 
        })
        .json({ message: 'Login successful', user });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  /**
     * Handles the forgot password request.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     */
  async forgotPassword(req, res) {
    try {
      const { email } = req.body;
      if (!email) {
        throw new Error('Email is required');
      }
      console.log(email)
      const result = await UserService.forgotPassword(email);
      res.status(200).json(result);
    } catch (error) {
      console.error(error.message);
      res.status(400).json({ error: error.message });
    }
  }
  /**
     * Handles the password reset request.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     */
  async resetPassword(req, res) {
    const { token, newPassword } = req.body;

    try {
      const response = await UserService.resetPassword(token, newPassword);
      res.status(200).json(response);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
  /**
   * Retrieves all users that are pending approval.
   * @param {Object} req - The HTTP request object.
   * @param {Object} res - The HTTP response object.
   * @returns {Promise<void>} - Responds with a list of pending users or an error message.
   * @throws {Error} - If an error occurs while fetching the pending users.
   */
  async getPendingUsers(req, res) {
    try {
      const pendingUsers = await UserService.getPendingUsers();
      res.status(200).json(pendingUsers);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * Approves a user to join a community
   * @param {Object} req - The HTTP request object containing the admin id and user id in the params
   * @param {Object} res - The HTTP response object
   * @returns {Promise<void>} - Responds with the updated community or an error message
   * @throws {Error} - If an error occurs while approving the user
   */
  async approveUser(req, res) {
    const { user_id } = req.params;
    const adminId = req.user.id;
    console.log(adminId);

    try {
      const result = await UserService.approveUser(adminId, user_id);
      try {
        await notificationService.notifyUser(user_id, 'registrationApproved', {
          message: 'Your registration request has been approved by the administrators.'
        });
      } catch (err) {
        console.error('Failed to notify approved user:', err.message);
      }
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * Rejects a user to join a community
   * @param {Object} req - The HTTP request object containing the admin id and user id in the params
   * @param {Object} res - The HTTP response object
   * @returns {Promise<void>} - Responds with the updated community or an error message
   * @throws {Error} - If an error occurs while rejecting the user
   */
  async rejectUser(req, res) {
    try {
      const { user_id } = req.params;
      const adminId = req.user.id;

      const result = await UserService.rejectUser(adminId, user_id);
      try {
        await notificationService.notifyUser(user_id, 'registrationRejected', {
          message: 'Your registration request has been rejected by the administrators.'
        });
      } catch (err) {
        console.error('Failed to notify rejected user:', err.message);
      }

      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  async verify(req, res) {
    try {
      const user = req.user;
      if (user) {
        const latestUser = await User.findOne({ id: user.id });
        if (latestUser) {
          return res.status(200).json(latestUser);
        }
        return res.status(200).json(user);
      }
      return res.status(401).json({ message: 'Unauthorized' });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }

  async logout(req, res) {
    try {
      const isProd = process.env.NODE_ENV === 'production';
      res.status(200)
      .cookie('token', '', { 
          httpOnly: true, 
          sameSite: isProd ? 'none' : 'lax', 
          secure: isProd, 
          expires: new Date(0) 
      })
      .json({ message: 'Logout successful' });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

module.exports = new UserController();
