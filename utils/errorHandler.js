import responder from './responseHandler.js';

// middleware for handling and returning all the errors from the APIs.
const errorHandler = (error, req, res, next) => {
  const logMessage = JSON.stringify({
    ip: req.header('x-forwarded-for') || req.connection.remoteAddress, // user's IP address
    url: req.url,
    userAgent: req.headers['user-agent'],
    method: req.method,
    time: Date.now()
  });
  if (error) {
    responder(res)(error);
    console.error(error);
    return;
  }
  console.debug(logMessage);
  next();
};

export default errorHandler;
