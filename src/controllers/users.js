import asyncHandler from '../middleware/asyncHandler.js';
import ResponseError from '../utils/ResponseError.js';

import User from '../models/User.js';


/**
 * Find all users
 * @route    GET /api/v1/users
 * @access   Public
 */
const findAll = asyncHandler(async (req, res, next) => {
  const data = await User.find();
  res.status(200).json({ success: true, data: data });
});

export {
  findAll
};