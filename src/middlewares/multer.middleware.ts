import multer from "multer";
import { cloudinaryStorage } from "../utils/cloudinary";

export const multerMiddleware = multer({
  storage: cloudinaryStorage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
}).single("media");
