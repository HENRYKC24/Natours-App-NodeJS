const { promisify } = require('util');
const jwt = require('jsonwebtoken');

const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const getJWTToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

exports.signup = catchAsync(async (req, res, next) => {
  // const { name, email, password, passwordConfirm } = req.body;
  const newUser = await User.create(req.body);

  const { _id } = newUser;

  const token = getJWTToken(newUser._id);

  res.status(200).json({
    status: 'success',
    token,
    data: {
      user: {
        name: newUser.name,
        email: newUser.email,
        _id,
      },
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password)
    return next(new AppError('Please, provide email and password', 400));

  // 2) Check if user exists && password is correct
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.checkPassword(password, user.password)))
    return next(new AppError('Incorrect email or password', 401));
  // 3) If everything is okay, send toke to client

  const token = getJWTToken(user._id);

  res.status(200).json({
    status: 'success',
    token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Get toke and check if it exists
  const { authorization } = req.headers;
  let token;
  if (authorization && authorization.startsWith('Bearer')) {
    token = authorization.split(' ')[1];
  }

  if (!token) return next(new AppError('Please, login or create account', 401));
  // 2) Verify tokens
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // 3) Check if user exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser)
    return next(
      new AppError('The user possessing this token does no longer exist.', 401)
    );

  // 4) Check if user changed password after the token was issued
  if (currentUser.passwordChangedAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password. Please, log in again.', 401)
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  next();
});

exports.restrictTo =
  (...roles) =>
  (req, res, next) => {
    const { role } = req.user;
    if (!roles.includes(role)) {
      return next(
        new AppError('You do not have permission to perform this action.', 403)
      );
    }

    next();
  };

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on POSTed email
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return next(new AppError('Email does not exist.', 404));
  }
  // 2) Generate the random reset taken
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  // 3) Send it to user's email
});

exports.resetPassword = catchAsync(async (req, res, next) => {});
