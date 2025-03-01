import reviewModel from "./../models/reviewsModel.js";

export const uploadImage = async (data, res) => {
  try {
    const newComment = await reviewModel.create(data);

    res.status(200).send({
      success: true,
      message: "Comment uploaded successfully",
      data: newComment,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: "Internal Server Error",
    });
  }
};
