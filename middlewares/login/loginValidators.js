const { check, validationResult } = require("express-validator");
const loginValidators = [
  check("username").isLength({ min: 1 }).withMessage("username is required!"),
  check("password").isLength({ min: 1 }).withMessage("password is required!"),
];

function loginValidationResult(req, res, next) {
  const errors = validationResult(req);
  const mappedErrors = errors.mapped();
  if (Object.keys(mappedErrors).length === 0) {
    next();
  } else {
    res.render("index", {
      data: {
        username: req.body.username,
      },
      errors: mappedErrors,
    });
  }
}

module.exports = { loginValidators, loginValidationResult };
