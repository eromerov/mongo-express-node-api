import crypto from 'crypto';
import asyncHandler from '../middleware/asyncHandler.js';
import ResponseError from '../utils/ResponseError.js';
import User from '../models/User.js'

/**
 * Register a user
 * @route    POST /api/v1/auth/register
 * @access   Public
 */
const register = asyncHandler(async (req, res, next) => {
  
  const { name, email, password, role } = req.body;

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    role
  });

  const token = user.getSignedJwtToken();

  res.status(200)
  .cookie('token', token, getCookieOptions())
  .json({ 
    success: true, 
    token: token 
  });
  
});


/**
 * Login
 * @route    POST /api/v1/auth/login
 * @access   Public
 */
 const login = asyncHandler(async (req, res, next) => {
  
  const { email, password } = req.body;


  //validate email and password
  if(!email || !password) {
    return next(new ResponseError('Please provide an email and password', 400));
  }

  //validate user
  const user = await User.findOne({ email }).select('+password');
  if(!user) {
    return next(new ResponseError('Invalid credentials', 401));
  }

  //validate password
  const isValid = await user.validatePassword(password)
  if (!isValid) {
    return next(new ResponseError('Invalid credentials', 401));
  }


  const token = user.getSignedJwtToken();

  res.status(200)
  .cookie('token', token, getCookieOptions())
  .json({ 
    success: true, 
    token: token 
  });
  
});



/**
 * Recovery Password
 * @route    POST /api/v1/auth/recoverypassword
 * @access   Public
 */
 const recoveryPassword = asyncHandler(async (req, res, next) => {
  
  const { email } = req.body;

  const user = await User.findOne({ email })
  if(!user) {
    return next(new ResponseError('No user exists with such email', 404));
  }

  const resetToken = await user.getResetToken();
  await user.save({ validateBeforeSave: false });


  //const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/resetpassword/${resetToken}`;
  //send email here.

  res.status(200)
  .json({ 
    success: true, 
    data: user
  });
  
});


/**
 * Reset Password
 * @route    PUT /api/v1/auth/resetpassword/:token
 * @access   Public
 */
 const resetPassword = asyncHandler(async (req, res, next) => {
  
  
  const resetPasswordToken = req.params.token
  const { password } = req.body;

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  });

  
  
  if(!user) {
    console.log('error');
    return next(new ResponseError('Token has been expired', 404));
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  res.status(200)
  .json({ 
    success: true, 
    data: user
  });
  
});



const getCookieOptions = () => {
  
  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };

  if(process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  return options;
};



export {
    register,
    login,
    recoveryPassword,
    resetPassword
}
