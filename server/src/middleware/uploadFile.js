import multer from "multer";
import path from "path";
import {
  ALLOWED_FILE_TYPE,
  MAX_FILE_SIZE,
  UPLOAD_USER_IMAGE_DIRECTORY,
} from "../config/index.js";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_USER_IMAGE_DIRECTORY);
  },
  filename: function (req, file, cb) {
    const extname = path.extname(file.originalname);
    cb(
      null,
      Date.now() + "-" + file.originalname.replace(extname, "") + extname
    );
  },
});

const fileFilter = (req, file, cb) => {
  const extname = path.extname(file.originalname);
  if (!ALLOWED_FILE_TYPE.includes(extname.substring(1))) {
    return cb(new Error("File type not allowed"), false);
  }
  cb(null, true);
};

export const upload = multer({
  storage: storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter,
});
