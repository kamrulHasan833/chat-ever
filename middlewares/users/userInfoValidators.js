const createError = require("http-errors");
const { check, validationResult } = require("express-validator");
const User = require("../../model/People");
const { unlink } = require("fs");
const path = require("path");
// validate user info to save database
const userInfoValidators = [
  check("name")
    .isLength({ min: 1 })
    .withMessage("Name is required!")
    .isAlpha("en-US", { ignore: " -" })
    .withMessage("Name must not contain anything other than alphabet!")
    .trim(),
  check("email")
    .isEmail()
    .withMessage("Email is required!")
    .trim()
    .custom(async (value) => {
      try {
        const user = await User.findOne({
          email: value,
        });
        if (user) {
          throw createError("Email already axist!");
        }
      } catch (err) {
        throw createError(err.message);
      }
    }),
  check("mobile")
    .isMobilePhone("bn-BD", {
      strictMode: true,
    })
    .withMessage("Mobile number must be a valid Bangladeshi mobile number!")
    .custom(async (value) => {
      try {
        const mobileNumber = await User.findOne({
          mobile: value,
        });
        if (mobileNumber) {
          throw createError("Mobile number already exist!");
        }
      } catch (err) {
        throw createError(err.message);
      }
    }),
  check("password")
    .isStrongPassword()
    .withMessage(
      "Password must be at least 8 characters and should contain at least 1 lowercase, 1 uppercase, 1number and 1 symbol!"
    )
    .trim(),
];

// resunlt validateion result middleware
function userInfoValidatorsResponse(req, res, next) {
  const errors = validationResult(req);
  const mappedErrors = errors.mapped();

  if (Object.keys(mappedErrors).length === 0) {
    next();
  } else {
    if (req.files.length > 0) {
      const { filename } = req.files[0];
      unlink(
        path.join(__dirname, `/../../public/uploads/avatar/${filename}`),
        (err) => {
          if (err) {
            console.log(err);
          }
        }
      );
    }
    res.status(400).json({
      errors: mappedErrors,
    });
  }
}

module.exports = { userInfoValidators, userInfoValidatorsResponse };
