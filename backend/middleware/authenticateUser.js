const jwt = require('jsonwebtoken');

const authenticateUser = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    console.log("unauthorised")
    return res.status(401).json({ message: 'Unauthorized' });
  }
  else
  {
    console.log("authorised")
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
    console.log(decoded)
    req.user = decoded; // Attach the user to the request object
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = authenticateUser;