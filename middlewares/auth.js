const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ message: "Access denied. No token provided." });

    try {
        // Hardcoded JWT secret key (must match the one used in login function)
        const secretKey = "dlb";

        // Verify token
        const decoded = jwt.verify(token.replace("Bearer ", "").trim(), secretKey);
        req.user = decoded;
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        res.status(400).json({ message: "Invalid token" });
    }
};
