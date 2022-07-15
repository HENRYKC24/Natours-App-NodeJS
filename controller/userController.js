const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const sanitizeBodyData = (bodyData, ...approvedFields) => {
  const updateData = {};
  Object.keys(bodyData).forEach((el) => {
    if (approvedFields.includes(el)) {
      updateData[el] = bodyData[el];
    }
  });
  return updateData;
};

exports.getUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    status: 'success',
    dataCount: users.length,
    data: {
      users,
    },
  });
});

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};

exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};

exports.updateUser = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This is not the route for update password. Please, use /update-password'
      )
    );
  }

  const updatedUser = sanitizeBodyData(req.body, 'name', 'email');

  const user = await User.findByIdAndUpdate(req.user.id, updatedUser, {
    new: true,
    runValidators: true,
  });
  res.status(201).json({
    status: 'success',
    data: {
      user,
    },
  });
});

exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};
