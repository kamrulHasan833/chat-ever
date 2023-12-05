const User = require("../model/People");
const bcrypt = require("bcrypt");
const createError = require("http-errors");
const jwt = require("jsonwebtoken");

// get login
function getLogin(req, res) {
  res.render("index");
}

// get signup
function getSignup(req, res) {
  res.render("signup");
}

async function login(req, res) {
  try {
    const user = await User.findOne({
      $or: [{ email: req.body.username }, { mobile: req.body.mobile }],
    });

    if (user && user._id) {
      const isPassword = await bcrypt.compare(req.body.password, user.password);
      if (isPassword) {
        const jwtBody = {
          id: user._id,
          username: user.name,
          email: user.email,
          mobile: user.mobile,
          role: user.role,
          avatar: user.avatar,
        };
        // create token
        const token = jwt.sign(jwtBody, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_LIFETIME,
        });

        res.cookie(process.env.COOKIE_NAME, token, {
          maxAge: process.env.JWT_LIFETIME,
          httpOnly: true,
          signed: true,
        });

        res.locals.loggedinUser = jwtBody;
        res.redirect("inbox");
      } else {
        throw createError(400, "Password wasn't matched!");
      }
    } else {
      throw createError(400, "User didn't exist against this username!");
    }
  } catch (err) {
    res.render("index", {
      data: {
        username: req.body.username,
      },
      errors: {
        common: {
          msg: err.message,
        },
      },
    });
  }
}
function logout(req, res) {
  res.clearCookie(process.env.COOKIE_NAME);
  res.send("Logged out.");
}
module.exports = { getLogin, login, logout, getSignup };
