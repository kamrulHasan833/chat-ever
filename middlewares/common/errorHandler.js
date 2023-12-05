const createError = require("http-errors");

// 404 handler
function notFoundErrorHandler(req, res, next) {
  next(createError(404, "Your requested route wasn't found!"));
}

// default error handler
function defaultErrorHandler(err, req, res, next) {
  res.locals.error =
    process.env.NODE_ENV === "development" ? err : { message: err.message };
  res.status(err.status || 500);

  if (res.locals.html) {
    res.render("error", {
      title: "Error Page ",
    });
  } else {
    res.json(res.locals.error);
  }
}

module.exports = {
  notFoundErrorHandler,
  defaultErrorHandler,
};
