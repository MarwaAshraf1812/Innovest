import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import validator from 'validator'
import Admin from "../db/models/adminModel.js";
import AdminDao from "../common/daos/admin.dao.js";

class AdminAuthServices {
    /**
     * Registers a new admin user with the given username, email and password.
     * @param {string} username - The username of the new admin user.
     * @param {string} email - The email of the new admin user.
     * @param {string} password - The password of the new admin user.
     * @returns {Promise<Admin>} - The newly registered admin user.
     * @throws {Error} If the user already exists or if there's an error while registering the user.
     */
    async register(username, email, password, role) {
        try {
            if (!username || !email || !password) {
                throw new Error('Username, email, or password is missing');
            }
            const user = await AdminDao.getAdminByEmail(email);
            if (user) {
                throw new Error('User already exists');
            }
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            const newUser = new Admin({
                username,
                email,
                password: hashedPassword,
                role: role || 'ADMIN'
            });
            const savedUser = await AdminDao.createAdmin(newUser);

            const payload = {
                user: {
                    savedUser
                }
            };
            const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
    
            // Return both the saved user and the token
            return { newAdmin: savedUser, token };
        } catch (error) {
            throw new Error(error.message);
        }
    }

    /**
     * Logs in an existing admin user with the given username or email and password.
     * @param {string} username_or_email - The username or email of the admin user.
     * @param {string} password - The password of the admin user.
     * @returns {Promise<string>} - The JWT token for the admin user.
     * @throws {Error} If the user does not exist or if the password is invalid.
     */
    async login(username_or_email, password) {
        try {
            // console.log(username_or_email)
            // const email = is_mail ? username_or_email : null;
            if (!username_or_email || !password) {
                throw new Error('Username or password is missing');
            }
            const user = validator.isEmail(username_or_email) ?
                await AdminDao.getAdminByEmail(username_or_email) :
                await AdminDao.getAdminByUsername(username_or_email);

            if (!user) {
                throw new Error('User not found');
            }
            // will be enabled when password hashing is enabled
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                throw new Error('Invalid password');
            }
            // if (password !== user.password) {
            //     throw new Error('Invalid password');
            // }
            const payload = {
                user: {
                    id: user.admin_id,
                    role: user.role,
                    permissions: user.permissions
                }
            };
            const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
            return token;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async logout(token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
            return decoded;
        } catch (error) {
            throw new Error('Invalid token');
        }
    }

}



export default new AdminAuthServices();