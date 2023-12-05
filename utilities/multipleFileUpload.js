const multer = require("multer");
const path = require("path");
const createError = require("http-errors");

function multipleFileUpload(
  subPath,
  fileSize,
  fileTypes,
  maxNumOfFile,
  errMess
) {
  const uploadFolder = path.join(__dirname, `/../public/uploads/${subPath}`);

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadFolder);
    },
    filename: (req, file, cb) => {
      const extension = path.extname(file.originalname);
      const filename =
        file.originalname
          .replace(extension, "")
          .toLowerCase()
          .split(" ")
          .join("-") + `-${Date.now()}`;
      cb(null, filename + extension);
    },
  });

  const upload = multer({
    storage,
    limits: {
      fileSize: fileSize,
    },
    fileFilter: (req, file, cb) => {
      if (req.files.length > maxNumOfFile) {
        cb(
          createError(
            400,
            `Maixmum ${maxNumOfFile} files are allowed to upload!`
          )
        );
      } else {
        if (fileTypes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(createError(400, errMess));
        }
      }
    },
  });

  return upload;
}
module.exports = multipleFileUpload;
