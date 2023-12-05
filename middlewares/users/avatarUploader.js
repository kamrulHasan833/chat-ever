const singleAavatarUploader = require("../../utilities/singleAvatarUploader");
// avatar uploader middleware
function avaterUploader(req, res, next) {
  const upload = singleAavatarUploader(
    "avatar",
    1048576,
    ["image/png", "image/jpg", "image/jpeg"],
    "Only .png, .jpg or .jpeg format allowed!"
  );

  // call the any middleware to upload
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

module.exports = avaterUploader;
