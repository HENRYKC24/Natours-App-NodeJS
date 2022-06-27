const express = require('express');

const userControllers = require('../controller/userController');

const { getUsers, createUser, getUser, updateUser, deleteUser } =
  userControllers;

const authController = require('../controller/authController');

const { signup } = authController;

// USERS ROUTES
const router = express.Router();

router.post('/signup', signup);

router.route('/').get(getUsers).post(createUser);

router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
