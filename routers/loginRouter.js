// external imports
const express = require("express");

// internal imports
const {
  getLogin,
  login,
  logout,
  getSignup,
} = require("../controllers/loginController");
const decorateHtml = require("../middlewares/common/decorateHtmlHandler");
const { redirectCheckLogin } = require("../middlewares/common/checkLogin");
const {
  loginValidators,
  loginValidationResult,
} = require("../middlewares/login/loginValidators");
// setup loginRouter
const loginRouter = express.Router();
const pageName = "Login";
// Get login
loginRouter.get("/", decorateHtml(pageName), redirectCheckLogin, getLogin);

//  sign up
loginRouter.get(
  "/signup",
  decorateHtml(pageName),

  getSignup
);
//  sign up
loginRouter.post(
  "/signup",
  decorateHtml(pageName),
  loginValidators,
  loginValidationResult,
  login
);
//  login
loginRouter.post(
  "/signin",
  decorateHtml(pageName),
  loginValidators,
  loginValidationResult,
  login
);

loginRouter.delete("/", logout);
module.exports = loginRouter;
