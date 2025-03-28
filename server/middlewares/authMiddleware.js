const jwt = require('jsonwebtoken');

const authenticateUser = (req, res, next) => {
  // Get token from header
  const token = req.header('Authorization')?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
    req.user = decoded; // Attach user data to request
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired" }); // Explicitly handle expired token
    }
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Middleware to check user roles
const authorizeRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden: Access denied' });
    }
    next();
  };
};

module.exports = {
  authenticateUser,
  donor: authorizeRole(['donor']),
  recipient: authorizeRole(['recipient']),
  admin: authorizeRole(['admin']),
  ngo: authorizeRole(['ngo']),
  multipleRoles: authorizeRole, // Pass an array like `multipleRoles(['admin', 'donor'])`
};
