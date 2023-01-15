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

export const getPublicId = (url: string) => {
  const splitUrl = url.split("/");
  const publicId = splitUrl[splitUrl.length - 1].split(".")[0];

  return publicId;
};

export const cloudinaryDelete = (publicId: string) => {
  return new Promise((resolve, reject) => {
    cloudinary.v2.uploader
      .destroy(publicId)
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
