const cloudinary = require("../configs/cloudinary.config");
const {
  s3,
  PutObjectCommand,
  GetObjectCommand,
} = require("../configs/s3.config");

const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { randomImageName } = require("../utils");

// upload file use S3Client//

const uploadImageFromLocalS3 = async ({ file }) => {
  try {
    const imageName = randomImageName();
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: imageName || "unknown",
      Body: file.buffer,
      ContentType: "image/jpeg",
    });

    const result = await s3.send(command);
    const singeUrl = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: imageName,
    });
    const url = await getSignedUrl(s3, singeUrl, { expiresIn: 3600 });
    return url;
  } catch (error) {
    console.error(`Error update image using S3Client: ${error.message}`);
  }
};

// upload file use Cloudinary
const uploadImageFromUrl = async () => {
  try {
    const urlName =
      "https://letsenhance.io/static/73136da51c245e80edc6ccfe44888a99/1015f/MainBefore.jpg";
    const folderName = "product/shopId",
      newFileName = "testdemo";

    const result = await cloudinary.uploader.upload(urlName, {
      folder: folderName,
    });

    return result;
  } catch (error) {
    console.error("Error uploading product image from URL: ", error);
  }
};

const uploadImageFromLocal = async ({ path, folderName = "product/8409" }) => {
  try {
    const result = await cloudinary.uploader.upload(path, {
      public_id: "thumb",
      folder: folderName,
    });

    return {
      image_url: result.secure_url,
      shopId: 8409,
    };
  } catch (error) {
    console.error(`Error update image ${error.message}`);
  }
};

module.exports = {
  uploadImageFromUrl,
  uploadImageFromLocal,
  uploadImageFromLocalS3,
};
