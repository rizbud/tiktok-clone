import cloudinary from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const cloudinaryStorage = new CloudinaryStorage({
  cloudinary: cloudinary.v2,
  params: {
    // @ts-ignore
    folder: "contents",
  },
});