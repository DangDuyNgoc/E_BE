import { uploadImage } from "../services/uploadImage.js";

export const createComments = async (req, res) => {
  try {
    const data = req.body.thumbnail;

    if (thumbnail) {
      const myCloud = await cloudinary.v2.uploader.upload(data, {
        folder: "images",
      });
      data.thumbnail = {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      };
    }
    uploadImage(data, res);
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: "Failed to update user role",
    });
  }
};
