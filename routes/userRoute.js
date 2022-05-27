const express = require('express');
const userControllers = require('../controller/userController');
const { getUsers, createUser, getUser, updateUser, deleteUser } =
  userControllers;
// USERS ROUTES
const route = express.Router();
route.route('/').get(getUsers).post(createUser);
route.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = route;