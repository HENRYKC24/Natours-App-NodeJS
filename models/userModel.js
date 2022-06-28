const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, 'A user must have a name'],
  },
  email: {
    type: String,
    required: [true, 'A user must have an email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Please, provide a password'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please, provide password confirmation'],
    validate: {
      // This only works on CREATE and SAVE!!!
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same',
    },
  },
  photo: String,
});

userSchema.pre('save', async function (next) {
  // Only run this function if password was not modified modified
  if (!this.isModified('password')) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordConfirm field as it is not needed in the database
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.checkPassword = async function (
  providedPassword,
  savedPassword
) {
  return await bcrypt.compare(providedPassword, savedPassword);
};

const User = mongoose.model('user', userSchema);

module.exports = User;
