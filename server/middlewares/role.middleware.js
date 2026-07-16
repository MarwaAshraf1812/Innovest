const { User } = require('../db/models/userModel');
const Admin = require('../db/models/adminModel');

const checkRole = (roles) => {
    return async (req, res, next) => {
        try {
            if (!req.user) {
                console.log('checkRole: No req.user found');
                return res.status(401).json({ message: 'Unauthorized: No user found' });
            }

            const userId = req.user.id;
            let user;
            if (req.user.role === 'ADMIN' || req.user.role === 'SUPER_ADMIN') {
                user = await Admin.findOne({ admin_id: userId });
                if (!user) {
                    console.log(`checkRole: Admin not found in DB with admin_id: ${userId}`);
                }
            } else {
                user = await User.findOne({ id: userId });
                if (!user) {
                    console.log(`checkRole: User not found in DB with id: ${userId}`);
                }
            }

            if (!user) {
                console.log(`checkRole: Access denied - user record not found in DB. req.user:`, req.user);
                return res.status(403).json({ message: 'Access denied: user record not found.' });
            }

            if (!roles.includes(user.role)) {
                console.log(`checkRole: Access denied - role mismatch. User role: ${user.role}, Allowed roles: ${roles}`);
                return res.status(403).json({ message: 'Access denied: insufficient permissions.' });
            }

            next();
        } catch (error) {
            console.error('Error checking user role:', error);
            return res.status(500).json({ message: 'Server error' });
        }
    };
};

module.exports = checkRole;
