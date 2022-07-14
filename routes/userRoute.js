const express = require('express');

const userControllers = require('../controller/userController');

const { getUsers, createUser, getUser, updateUser, deleteUser } =
  userControllers;

const authController = require('../controller/authController');

const { signup, login, forgotPassword, resetPassword } = authController;

// USERS ROUTES
const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.patch('/reset-password/:token', resetPassword);

router.route('/').get(getUsers).post(createUser);

router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
