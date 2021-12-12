import crypto from 'crypto';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Debe ingresar un nombre de usuario'],
    unique: true,
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Debe ingresar una constraseña'],
    minlength: 8,
    select: false,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createAt: {
    type: Date,
    default: Date.now,
  },
});

//Encrypt password before save (mongoose middleware)
UserSchema.pre('save', async function (next) {
  if(!this.isModified('password')){
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

//Get JWT
UserSchema.methods.getSignedJwtToken = function () {
  const secret = process.env.JWT_SECRET;
  const expire = process.env.JWT_EXPIRE;
  return jwt.sign({ id: this._id }, secret, {
    expiresIn: expire,
  });
};

//Validate Password
UserSchema.methods.validatePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

//Reset Token
UserSchema.methods.getResetToken = async function () {

  const resetToken = crypto.randomBytes(20).toString('hex');
  console.log('token:' + resetToken);

  // Hash token and set to resetPasswordToken field
  /*
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  */  

  this.resetPasswordToken = resetToken;
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

export default mongoose.model('User', UserSchema);
