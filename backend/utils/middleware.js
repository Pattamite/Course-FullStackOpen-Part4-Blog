const jwt = require('jsonwebtoken');
const logger = require('./logger');
const User = require('../models/user');
const config = require('../utils/config');


function requestLogger(request, response, next) {
  logger.info('Method:', request.method);
  logger.info('Path:  ', request.path);
  logger.info('Body:  ', request.body);
  logger.info('---');
  next();
}

function tokenExtractor(request, response, next) {
  const authorization = request.get('authorization');
  if(authorization && authorization.toLowerCase().startsWith('bearer ')) {
    request.token = authorization.substring(7);
  }
  next();
}

function userIdExtractor(request, response, next) {
  let token = null;
  const authorization = request.get('authorization');
  if(authorization && authorization.toLowerCase().startsWith('bearer ')) {
    token = authorization.substring(7);
  }
  if(token) {
    const decodedToken = jwt.verify(token, config.SECRET);
    if(decodedToken.id) {
      request.userId = decodedToken.id;
    }
  }
  next();
}

function unknownEndpoint (request, response) {
  response.status(404).send({ error: 'unknown endpoint' });
}

function errorHandler (error, request, response, next) {
  logger.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(400).json({ error: 'invalid token' });
  } else if (error.name === 'TokenExpiredError') {
    return response.status(400).json({ error: 'token expired' });
  }

  next(error);
}

module.exports = {
  requestLogger,
  tokenExtractor,
  userIdExtractor,
  unknownEndpoint,
  errorHandler
};