import cloudinary from "cloudinary";
import bannerModel from "./../models/bannerModel.js";

export const createBanner = async (req, res) => {
  try {
    const { title, image } = req.body;
    const myCloud = await cloudinary.v2.uploader.upload(image, {
      folder: "banner",
    });

    const banner = {
      title,
      image: {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      },
    };

    await bannerModel.create(banner);

    res.status(200).send({
      success: true,
      message: "Banner created successfully",
      banner: banner,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const updateBanner = async (req, res) => {
  try {
    const { bannerId } = req.params;
    const { title, image } = req.body;

    const existingBanner = await bannerModel.findById(bannerId);

    if (!existingBanner) {
      return res.status(404).send({
        success: false,
        message: "Banner not found",
      });
    }

    let newImage = existingBanner.image;

    if (image) {
      // remove old image on cloud storage
      if (existingBanner.image && existingBanner.image.public_id) {
        await cloudinary.v2.uploader.destroy(
          image,
          existingBanner.image.public_id
        );
      }

      // upload new image on cloud storage
      const myCloud = await cloudinary.v2.uploader.upload(image, {
        folder: "banner",
      });

      newImage = {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      };
    }

    const newBanner = await bannerModel.findByIdAndUpdate(
      bannerId,
      {
        title,
        image: newImage,
      },
      { new: true }
    );

    res.status(200).send({
      success: true,
      message: "Banner updated successfully",
      data: newBanner,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: "Internal Server Error",
    });
  }
};
