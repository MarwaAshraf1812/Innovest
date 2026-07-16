const jwt = require('jsonwebtoken');

const AuthMiddleware = () => {
    return (req, res, next) => {
        const token = req.cookies.token;

        if (req.path === '/forgot-password') {
            return next();
        }

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized: No token provided' });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
            req.user = decoded.user;

            next();
        } catch (error) {
            return res.status(401).json({ message: 'Unauthorized: Invalid token' });
        }
    };
};

module.exports = AuthMiddleware;
