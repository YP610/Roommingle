const jwt = require('jsonwebtoken');
const User = require('../models/userSchema'); // Adjust path as needed

const requireAuth = async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({ error: 'Authorization token required' });
    }

    const token = authorization.split(' ')[1]; // Remove "Bearer " prefix

    try {
        const { _id } = jwt.verify(token, process.env.JWT_SECRET); // Use env variable
        req.user = await User.findById(_id).select('_id'); // Attach user to request
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expired' });
        }
        res.status(401).json({ error: 'Request not authorized' });
    }
};

// Export at the BOTTOM (after requireAuth is defined)
module.exports = requireAuth;