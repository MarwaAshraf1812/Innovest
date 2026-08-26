const AdminAuthServices = require('../services/admin_auth.service');
const RegisterDTO = require('../common/dtos/auth/register_admin.dto');
const LoginDTO = require('../common/dtos/auth/login.dto');
const Admin = require('../db/models/adminModel')

class AdminAuthController {
  async register(req, res) {
    const { username, email, password, role } = req.body;
    const registerDTO = new RegisterDTO(username, email, password);

    if (!registerDTO.isValid()) {
      return res.status(400).json({ message: 'Invalid registration data' });
    }
    try {

      const newAdmin = await AdminAuthServices.register(
        username,
        email,
        password,
        role
      );
      res.status(201).json({ message: 'Registration successful', newAdmin });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
  /**
   * Logs in an existing admin user with the given username or email and password.
   * @param {Object} req - The HTTP request object containing the username or email and password in the body.
   * @param {Object} res - The HTTP response object.
   * @returns {Promise<void>} - Responds with a JWT token for the admin user in a cookie or an error message.
   * @throws {Error} If the user does not exist or if the password is invalid.
   */
  async login(req, res) {
    const username_or_email = req.body.username_or_email || req.body.email || req.body.username;
    const { password } = req.body;
    const loginDTO = new LoginDTO(username_or_email, password);

    const user = await Admin.findOne({ 
      $or: [
        { email: username_or_email },
        { username: username_or_email }
      ]
    })
    if (!user) {
      return res.status(404).json({ message: 'User not Found' });
    }

    const validationError = loginDTO.isValid();  // to capture validation error
    if (validationError) {
        return res.status(400).json({ message: validationError });
    }
    try {
        const token = await AdminAuthServices.login(username_or_email, password);
        const isProd = process.env.NODE_ENV === 'production';
        res.status(200)
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
   * Logs out an existing admin user by clearing the JWT token cookie.
   * @param {Object} req - The HTTP request object.
   * @param {Object} res - The HTTP response object.
   * @returns {Promise<void>} - Responds with a 200 status code if successful or an error message.
   * @throws {Error} If there's an error while logging out the user.
   */
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
      .json({ message: 'Logout'});
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

module.exports = new AdminAuthController();
