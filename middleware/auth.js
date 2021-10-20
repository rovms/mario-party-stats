const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    console.log(token);
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    console.debug('Decoded IP', decodedToken.ip);
    console.debug('Request IP', ip);
    if (ip && ip !== decodedToken.ip) {
      return res.status(401).send("IP did not match.");
    } else {
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};