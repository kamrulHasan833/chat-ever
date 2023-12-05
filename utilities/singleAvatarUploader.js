const multer = require("multer");
const path = require("path");
const createError = require("http-errors");

// single image file uploader
function singleAavatarUploader(
  subfoler_path,
  fileSize,
  fileTypes,
  errorMessage
) {
  // get main folder path
  const folderPath = path.join(
    __dirname,
    `/../public/uploads/${subfoler_path}`
  );

  // define upload storage
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, folderPath);
    },
    filename: (req, file, cb) => {
      const extenstion = path.extname(file.originalname);
      const filename =
        file.originalname
          .replace(extenstion, "")
          .toLocaleLowerCase()
          .split(" ")
          .join("-") + `-${Date.now()}`;

      cb(null, filename + extenstion);
    },
  });
  const upload = multer({
    storage,
    limits: {
      fileSize,
    },
    fileFilter: (req, file, cb) => {
      if (fileTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(createError(errorMessage));
      }
    },
  });
  return upload;
}

module.exports = singleAavatarUploader;
