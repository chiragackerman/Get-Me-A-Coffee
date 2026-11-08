import { v2 as cloudinary } from "cloudinary";

export async function uploadProfileImage(buffer) {
  const config = {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  };
  const missingSettings = Object.entries(config)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missingSettings.length > 0) {
    throw new Error(
      `Cloudinary is missing server configuration: ${missingSettings.join(", ")}`,
    );
  }

  cloudinary.config(config);

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "get-me-a-coffee/creators",
        resource_type: "image",
        allowed_formats: ["jpg", "png", "webp"],
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else if (!result?.secure_url || !result.public_id) {
          reject(new Error("Cloudinary did not return the uploaded image details."));
        } else {
          resolve({
            secureUrl: result.secure_url,
            publicId: result.public_id,
          });
        }
      },
    );

    uploadStream.end(buffer);
  });
}

export async function deleteProfileImage(publicId) {
  return cloudinary.uploader.destroy(publicId, { resource_type: "image" });
}
