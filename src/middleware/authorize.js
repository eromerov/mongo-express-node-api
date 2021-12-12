import jwt from 'jsonwebtoken';
import asyncHandler from './asyncHandler.js';
import ResponseError from '../utils/ResponseError.js';
import User from '../models/User.js';

const authorize = (...roles) => {
  
  return asyncHandler(async (req, res, next) => {

    const { headers } = req;

    //validate header
    if (!headers.authorization || !headers.authorization.startsWith('Bearer')) {
      return next(new ResponseError('Not authorized to access this resource', 401));
    }

    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    

    //validate user
    if (!user) {
      return next(new ResponseError('Not authorized to access this resource', 401));
    }    

    //validate roles 
    if(roles.length  > 0) {
      if(!roles.includes(user.role)) {
        return next(new ResponseError('Not authorized to access this resource', 403));
      }
    }
    
    next();

  });
};


export { authorize };
