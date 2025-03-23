import { removeImage } from "../helpers/handleImageHelper.js";
import replyModel from "../models/replyModel.js";
import reviewModel from "../models/reviewsModel.js";
import path from "path";

//review service
export const getAllReviewsByProductIdService = async (productId) => {
  try {
    const gotAllReviews = await reviewModel
      .find({ product: productId })
      .sort({ createdAt: -1 })
      .populate("user", "name")
      .lean();
    const reviewsWithReplyStatus = await Promise.all(
      gotAllReviews.map(async (review) => {
        const replyCount = await replyModel.countDocuments({
          review: review._id,
        });
        return {
          ...review,
          hasReply: replyCount > 0,
        };
      })
    );
    return reviewsWithReplyStatus;
  } catch (error) {
    throw error;
  }
};

export const addReviewProductService = async (
  comment,
  productId,
  userId,
  imageUrl
) => {
  try {
    const newReviewData = {
      comments: comment,
      product: productId,
      user: userId,
    };
    if (imageUrl) {
      newReviewData.image = imageUrl;
    }
    const addReiview = await reviewModel.create(newReviewData);
    return addReiview;
  } catch (error) {
    throw error;
  }
};

export const updateReviewByUserService = async (
  comment,
  id,
  userId,
  newImage
) => {
  try {
    const checkId = await reviewModel.find({
      user: userId,
    });
    if (checkId.length === 0) {
      return { statusCode: 403 };
    }
    const oldImage = await getUriImageReview(id);
    const newData = {};
    newData.comment = comment;
    if (newImage && oldImage !== newImage) {
      removeImage(path.basename(oldImage));
      newData.image = newImage;
    }
    const updatedReview = await reviewModel.findByIdAndUpdate(id, newData, {
      new: true,
    });
    return updatedReview;
  } catch (error) {
    throw error;
  }
};

const getUriImageReview = async (id) => {
  try {
    const product = await reviewModel.findById(id).select("image");
    return product?.image || null;
  } catch (error) {
    console.log(error);
  }
};

export const deleteReviewService = async (id, userId) => {
  try {
    const checkId = await reviewModel.find({
      user: userId,
    });
    if (checkId.length === 0) {
      return { statusCode: 403 };
    }
    const image = await getUriImageReview(id);
    if (image) {
      image.forEach((images) => {
        const imageName = path.basename(images);
        removeImage(imageName);
      });
    }
    const deletedReview = await reviewModel.findByIdAndDelete(id);
    return deletedReview;
  } catch (error) {
    throw error;
  }
};

// reply service
export const addReplyService = async (reviewId, userId, comment) => {
  try {
    const addedReply = await replyModel.create({
      review: reviewId,
      user: userId,
      comments: comment,
    });
    return addedReply;
  } catch (error) {
    throw error;
  }
};

export const updateReplyService = async (id, userId, comments) => {
  try {
    const checkId = await replyModel.find({
      user: userId,
    });
    if (checkId.length === 0) {
      return { statusCode: 403 };
    }
    const updatedReply = await replyModel.findByIdAndUpdate(
      id,
      {
        comments: comments,
      },
      { new: true }
    );
    return updatedReply;
  } catch (error) {
    throw error;
  }
};

export const getReviewAndReplyService = async (reviewId, page, limit) => {
  try {
    const gotReply = await replyModel
      .find({ review: reviewId })
      .populate("user", "name")
      .sort({ createdAt: 1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    return gotReply;
  } catch (error) {
    throw error;
  }
};

export const deleteReplyService = async (id, userId) => {
  try {
    const checkId = await replyModel.find({
      user: userId,
    });
    if (checkId.length === 0) {
      return { statusCode: 403 };
    }
    const deletedReply = await replyModel.findByIdAndDelete(id);
    return deletedReply;
  } catch (error) {
    throw error;
  }
};
