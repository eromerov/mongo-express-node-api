import ResponseError from '../utils/ResponseError.js';

// Error Handling
// https://expressjs.com/en/guide/error-handling.html

const errorHandler = (err, req, res, next) => {

  let error = { ...err };
  error.message = err.message;

  //console.log(err); //for dev only

  // Mongoose bad ObjectId error
  if (err.name === 'CastError') {
    error = new ResponseError('Resource not found', 404);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    error = new ResponseError('Duplicate field value entered', 400);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((val) => val.message);
    error = new ResponseError(message, 400);
  }

  // Errors
  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error',
  });

};

export default errorHandler;
