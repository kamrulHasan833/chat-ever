const multipleFileUpload = require("../../utilities/multipleFileUpload");
function attachmentUpload(req, res, next) {
  const upload = multipleFileUpload(
    "attachments",
    1048576,
    ["image/png", "image/jpg", "image/jpeg"],
    2,
    "Only .png, .jpg or .jpeg format allowed!"
  );

  //   call the middleware function
  upload.any()(req, res, (err) => {
    if (err) {
      res.status(500).json({
        errors: {
          avatar: {
            msg: err.message,
          },
        },
      });
    } else {
      next();
    }
  });
}

module.exports = attachmentUpload;
