// html and title related middleware
function docorateHtmlHandler(pageTitle) {
  return (req, res, next) => {
    res.locals.html = true;
    res.locals.title = `${pageTitle} -${process.env.APP_NAME}`;
    res.locals.loggedinUser = {};
    res.locals.data = {};
    res.locals.users = [];
    res.locals.errors = {};
    next();
  };
}
module.exports = docorateHtmlHandler;
