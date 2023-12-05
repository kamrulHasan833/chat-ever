// external imports
const express = require("express");

// internal imports
const {
  getUsers,
  addUser,
  deleteUser,
} = require("../controllers/usersController");
const decorateHtml = require("../middlewares/common/decorateHtmlHandler");
const avatarUploader = require("../middlewares/users/avatarUploader");
const { checkLogin } = require("../middlewares/common/checkLogin");
const {
  userInfoValidators,
  userInfoValidatorsResponse,
} = require("../middlewares/users/userInfoValidators");

// setup users router
const usersRouter = express.Router();

// get user
usersRouter.get("/", decorateHtml("Users"), checkLogin, getUsers);

// add user
usersRouter.post(
  "/",
  avatarUploader,

  userInfoValidators,
  userInfoValidatorsResponse,
  addUser
);

// delete an user
usersRouter.delete("/:id", deleteUser);
module.exports = usersRouter;
