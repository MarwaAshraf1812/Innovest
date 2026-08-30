import userDao from '../common/daos/user.dao.js';
import AdminDao from '../common/daos/admin.dao.js';
import FileManagement from './file_management.service.js';
import nodemailer from 'nodemailer';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import validator from 'validator';
import crypto from 'crypto';
import { getIo } from '../config/socket.js';

const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

class UserServices {
    async register(user, documents = []) {
        console.log(user);

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        user.password = hashedPassword;
        
        const documents_directories = [];
        if (documents && documents.length > 0) {
            for (const document of documents) {
                try {
                    const savedPath = await FileManagement.save_file(document);
                    documents_directories.push(savedPath);
                } catch (error) {
                    throw new Error('Error saving file: ' + error.message);
                }
            }
        }

        user.id_documents = documents_directories;
        user.is_verified = false;
        try {
            const savedUser = await userDao.createUser(user);
            const payload = {
                user: {
                    id: savedUser.id,
                    role: savedUser.role,
                    national_id: savedUser.national_id,
                    email: savedUser.email,
                    username: savedUser.username,
                    permissions: savedUser.permissions
                }
            };
            getIo().emit('new_user_registered', savedUser);
            const refreshSecret = process.env.REFRESH_TOKEN_SECRET || (process.env.JWT_SECRET_KEY + '_refresh');
            const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
            const refreshToken = jwt.sign(payload, refreshSecret, { expiresIn: '7d' });

            // Store hashed refresh token in database
            await userDao.updateUser(savedUser.id, { refresh_token: hashToken(refreshToken) });

            return { token, refreshToken };
        } catch (error) {
            for (const filePath of documents_directories) {
                await FileManagement.delete_file(filePath);
            }
            throw new Error('Error creating user: ' + error.message);
        }
    }

    async login(username_or_email, password) {
        if (!username_or_email || !password) {
            throw new Error('Username/email or password is missing');
        }
        const user = validator.isEmail(username_or_email) ?
            await userDao.getUserByEmail(username_or_email) :
            await userDao.getUserByUsername(username_or_email);

        if (!user) {
            throw new Error('Invalid credentials');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error('Invalid credentials');
        }

        if (!user.is_verified) {
            throw new Error('Your account is pending approval. Please wait for admin verification.');
        }
        const payload = {
            user: {
                id: user.id,
                role: user.role,
                national_id: user.national_id,
                permissions: user.permissions
            }
        };
        const refreshSecret = process.env.REFRESH_TOKEN_SECRET || (process.env.JWT_SECRET_KEY + '_refresh');
        const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
        const refreshToken = jwt.sign(payload, refreshSecret, { expiresIn: '7d' });

        // Store hashed refresh token in database
        await userDao.updateUser(user.id, { refresh_token: hashToken(refreshToken) });

        return { token, refreshToken };
    }

    async refreshAccessToken(refreshToken) {
        if (!refreshToken) {
            throw new Error('Refresh token is required');
        }
        const refreshSecret = process.env.REFRESH_TOKEN_SECRET || (process.env.JWT_SECRET_KEY + '_refresh');
        try {
            const decoded = jwt.verify(refreshToken, refreshSecret);
            const user = await userDao.getUserById(decoded.user.id);

            // Server-side revocation check: Ensure user exists and stored hash matches incoming token hash
            if (!user || !user.refresh_token || user.refresh_token !== hashToken(refreshToken)) {
                throw new Error('Invalid or revoked refresh token');
            }

            const payload = {
                user: {
                    id: user.id,
                    role: user.role,
                    national_id: user.national_id,
                    permissions: user.permissions
                }
            };
            const newToken = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
            const newRefreshToken = jwt.sign(payload, refreshSecret, { expiresIn: '7d' });

            // Rotate refresh token: Update database with hash of new refresh token
            await userDao.updateUser(user.id, { refresh_token: hashToken(newRefreshToken) });

            return { token: newToken, refreshToken: newRefreshToken };
        } catch (error) {
            throw new Error('Invalid or expired refresh token');
        }
    }

    async revokeRefreshToken(userId) {
        if (userId) {
            await userDao.updateUser(userId, { refresh_token: null });
        }
    }

    /**
     * Sends a password reset email to the user with the given email.
     * @param {string} email - The email of the user.
     * @returns {Promise<Object>} - An object with a message indicating if the email was sent successfully.
     * @throws {Error} If the user does not exist or if there's an error while sending the email.
     */
    async forgotPassword(email) {
        try {
            const user = await userDao.getUserByEmail(email);

            if (!user) {
                throw new Error('User not found');
            }

            const resetToken = jwt.sign({id: user.id}, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
            const resetTokenExpiry = Date.now() + 3600000;

            await userDao.updateUser(user.id, {
                reset_token: resetToken,
                reset_token_expiry: resetTokenExpiry
            });

            // Send password reset email
            const resetLink = `https://client-ruddy-iota-11.vercel.app/reset-password?token=${resetToken}`;
            await this.sendPasswordResetEmail(user.email, resetLink);

            return { message: 'Password reset link sent to your email.' };
        } catch (error) {
            throw new Error('Error sending reset password email: ' + error.message);
        }
    }

    /**
     * Sends a password reset email to the user.
     * @param {string} toEmail - The user's email address.
     * @param {string} resetLink - The password reset link.
     */
    async sendPasswordResetEmail(toEmail, resetLink) {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: toEmail,
            subject: 'Password Reset Request',
            text: `We received a request to reset your password. Please click the link below to reset your password:\n\n${resetLink}\n\nIf you did not request this, please ignore this email.`
        };

        try {
            await transporter.sendMail(mailOptions);
            console.log('Password reset email sent successfully to:', toEmail);
        } catch (error) {
            console.error('Error sending password reset email:', error.message);
            throw new Error('Error sending password reset email: ' + error.message);
        }
    }
    
    /**
     * Reset the password for a user using a reset token.
     * @param {string} token - The reset token from the request query.
     * @param {string} newPassword - The new password from the request body.
     * @returns {Promise<{message: string}>} - A success or error message.
     */
    async resetPassword(token, newPassword) {
        if (!token || !newPassword) {
            throw new Error('Token and new password are required.');
        }

        const {id} = jwt.decode(token);

        const user = await userDao.getUserById(id);
        
        if (!user) {
            throw new Error('User not found or token is expired.');
        }
        
        console.log(user);

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        await userDao.updateUser(user.id, {
            password: hashedPassword,
            reset_token: undefined,
            reset_token_expiry: undefined,
        });

        return { message: 'Password has been successfully reset.' };
    }
    
    /**
     * Retrieves all users that are pending approval.
     * @returns {Promise<User[]>} - Array of all pending users.
     * @throws {Error} - If an error occurs while fetching the pending users.
     */
    async getPendingUsers() {
        try {
            const pendingUsers = await userDao.getUsersByVerifiedStatus(false);
            return pendingUsers;
        } catch (error) {
            throw new Error('Error fetching pending users: ' + error.message);
        }
    }

    /**
     * Approves a user to join a community
     * @param {String} adminId - The unique id of the admin user to notify about the new user.
     * @param {String} userId - The unique id of the user to approve.
     * @returns {Promise<Object>} - The updated user with the approved status.
     * @throws {Error} - If an error occurs while approving the user.
     */
    async approveUser(adminId, userId) {
        try {
            const admin = await AdminDao.getAdminByID(adminId);
            if (!admin || (admin.role !== 'ADMIN' && admin.role !== 'SUPER_ADMIN')) {
                throw new Error('Permission denied: Only admins can approve users');
            }

            const user = await userDao.getUserById(userId);
            if (!user) {
                throw new Error('User not found');
            }

            if (user.is_verified) {
                throw new Error('User is already approved');
            }

            user.is_verified = true;
            await userDao.updateUser(userId, { is_verified: true });

            // Send email to user after approval
            console.log('Sending approval email to:', user.email);
            try {
                await this.sendApprovalEmail(user.email, user.username);
            } catch (mailErr) {
                console.warn('Failed to send approval email (likely missing SMTP credentials), proceeding anyway:', mailErr.message);
            }

            return { message: 'User approved successfully' };
        } catch (error) {
            console.error('Error approving user:', error.message);
            throw new Error('Error approving user: ' + error.message);
        }
    }

    /**
     * Rejects a user to join a community
     * @param {String} adminId - The unique id of the admin user to notify about the rejected user.
     * @param {String} userId - The unique id of the user to reject.
     * @returns {Promise<Object>} - The updated user with the rejected status.
     * @throws {Error} - If an error occurs while rejecting the user.
     */
    async rejectUser(adminId, userId) {
        try {
            const admin = await AdminDao.getAdminByID(adminId);
            if (!admin || (admin.role !== 'ADMIN' && admin.role !== 'SUPER_ADMIN')) {
                throw new Error('Permission denied: Only admins can reject users');
            }
            const user = await userDao.getUserById(userId);
            if (!user) {
                throw new Error('User not found');
            }

            await userDao.deleteUser(userId);
            return { message: 'sorry, but we can not approve your account , please check your data again.' };
        } catch (error) {
            throw new Error('Error rejecting user: ' + error.message);
        }
    }

    /**
     * Sends an approval email to the user after their account has been approved by an admin.
     * @param {String} toEmail - The email address of the user to send the approval email to.
     * @param {String} username - The username of the user to include in the email.
     * @throws {Error} - If an error occurs while sending the email.
     */
    async sendApprovalEmail(toEmail, username) {
        if (!toEmail || !username) {
            throw new Error('Invalid email or username');
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: toEmail,
            subject: 'Account Approved',
            text: `Dear ${username},\n\nYour account has been approved. You can now fully access the platform.\n\nBest regards,\nThe Team`
        };

        try {
            await transporter.sendMail(mailOptions);
            console.log('Approval email sent successfully to:', toEmail);
        } catch (error) {
            console.error('Error sending approval email:', error.message);
            throw new Error('Error sending approval email: ' + error.message);
        }
    }
}

export default new UserServices();
