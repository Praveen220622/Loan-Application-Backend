const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware: Protect routes (verify JWT token)
const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer ')
    ) {
        token = req.headers.authorization.split(' ')[1];

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await User.findById(decoded.id).select('-password');
            if (!req.user) {
                return res.status(401).json({ message: 'Not authorized: user not found' });
            }

            next();
        } catch (err) {
            console.error('JWT verification failed:', err);
            return res.status(401).json({ message: 'Not authorized: invalid token' });
        }
    } else {
        return res.status(401).json({ message: 'Not authorized: no token provided' });
    }
};

// Middleware: Role-based access control
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Forbidden: insufficient role' });
        }
        next();
    };
};

module.exports = {
    protect,
    authorizeRoles,
};
