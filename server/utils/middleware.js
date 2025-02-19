import logger from './logger.js';

const requestLogger = (req, _res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler = (error, _request, response, next) => {
  logger.error(error.message);
  return response.status(400).json({ error: error.message });
};

export default { requestLogger, unknownEndpoint, errorHandler };
