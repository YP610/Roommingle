const jwt = require('jsonwebtoken');
const User = require('../models/userSchema'); // Adjust path as needed

const requireAuth = async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({ error: 'Authorization token required' });
    }

    const token = authorization.split(' ')[1]; // Remove "Bearer " prefix

    try {
        const { _id } = jwt.verify(token, 'your_secret_key'); // Replace with env variable
        req.user = await User.findById(_id).select('_id'); // Attach user to request
        next();
    } catch (error) {
        res.status(401).json({ error: 'Request not authorized' });
    }
};

module.exports = requireAuth;
