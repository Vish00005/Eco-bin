const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const hasCloudinaryConfig = Boolean(
  process.env.CLOUD_NAME && process.env.CLOUD_API_KEY && process.env.CLOUD_API_SECRET
);

let storage;
if (hasCloudinaryConfig) {
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
  });

  storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "e-waste",
      allowed_formats: ["jpg", "png", "jpeg"],
    },
  });
} else {
  storage = multer.memoryStorage();
}

const upload = multer({ storage });

module.exports = upload;
