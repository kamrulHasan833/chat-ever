const jwt = require("jsonwebtoken");
function checkLogin(req, res, next) {
  const cookies =
    Object.keys(req.signedCookies).length > 0 ? req.signedCookies : null;

  if (cookies) {
    try {
      const token = cookies[process.env.COOKIE_NAME];
      const user = jwt.verify(token, process.env.JWT_SECRET);
      if (res.locals.html) {
        res.locals.loggedinUser = user;
      }

      req.user = user;
      next();
    } catch (err) {
      if (res.locals.html) {
        res.redirect("/");
      } else {
        res.status(401).json({
          errors: {
            common: {
              msg: "Authentication Failed!",
            },
          },
        });
      }
    }
  } else {
    if (res.locals.html) {
      res.redirect("/");
    } else {
      res.status(401).json({
        errors: {
          common: {
            msg: "Authentication Failed!",
          },
        },
      });
    }
  }
}

// redirect loggedin user to inbox page
function redirectCheckLogin(req, res, next) {
  const signedCookies = req.signedCookies;
  const cookies = Object.keys(signedCookies).length > 0 ? signedCookies : null;

  if (cookies) {
    res.redirect("/inbox");
  } else {
    next();
  }
}

module.exports = { checkLogin, redirectCheckLogin };
