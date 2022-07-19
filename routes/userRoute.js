const express = require('express');

const userControllers = require('../controller/userController');

const { getUsers, createUser, getUser, updateMe, deleteMe, deleteUser } =
  userControllers;

const authController = require('../controller/authController');

const {
  protect,
  signup,
  login,
  forgotPassword,
  resetPassword,
  updatePassword,
} = authController;

// USERS ROUTES
const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);

router.post('/forgot-password', forgotPassword);
router.patch('/reset-password/:token', resetPassword);

router.patch('/update-password', protect, updatePassword);
router.delete('/delete-me', protect, deleteMe);

router.patch('/update-user', protect, updateMe);

router.route('/').get(getUsers).post(createUser);

router.route('/:id').get(getUser).delete(deleteUser);

module.exports = router;
