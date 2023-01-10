import type { Request, Response, NextFunction } from "express";
import multer from "multer";
import responseJson from "../helpers/response-json";
import { cloudinaryStorage } from "../utils/cloudinary";

export const upload = multer({
  storage: cloudinaryStorage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. File type should be image"));
    }
  },
  limits: {
    fileSize: 1024 * 1024 * 2,
  },
});

export const multerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return upload.single("media")(req, res, async (err) => {
    if (err?.message) {
      return responseJson(res, 422, {
        message: err?.message,
      });
    }

    next();
  });
};
