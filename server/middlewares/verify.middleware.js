const jwt = require('jsonwebtoken');

const Verify = () => {
    return (req, res, next) => {
        const token = req.query.token;

        console.log("Request path:", req.path);
        console.log("Token in request:", token);

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized: No token provided' });
        }

        try {
            // Decode the token using the secret key
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

            if (!decoded || !decoded.user) {
                return res.status(401).json({ message: 'Unauthorized: No user found' });
            }

            req.user = decoded.user; 
            // console.log('Decoded token:', decoded);

            return next();
        } catch (error) {
            console.error("Token verification error:", error.message);
            return res.status(401).json({ message: 'Unauthorized: Invalid token' });
        }
    };
};

module.exports = Verify;
