import {
  addReplyService,
  addReviewProductService,
  deleteReplyService,
  deleteReviewService,
  getAllReviewsByProductIdService,
  getReviewAndReplyService,
  updateReplyService,
  updateReviewByUserService,
} from "../services/reviewService.js";

//review
export const getAllReviewByProductId = async (req, res) => {
  const { productId } = req.params;
  try {
    const result = await getAllReviewsByProductIdService(productId);
    if (!result) {
      return res
        .status(404)
        .json({ success: false, message: "Not found review" });
    }
    return res.status(200).json({
      success: true,
      message: "Get all reviews by productID successfully",
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const addReviewController = async (req, res) => {
  const { comments, userId, productId } = req.body;
  const baseUrl = `${req.protocol}://${req.get("host")}`;
  const imageUrls =
    req.files?.map((file) => `${baseUrl}/${file.filename}`) || [];
  try {
    const result = await addReviewProductService(
      comments,
      productId,
      userId,
      imageUrls
    );
    return res.status(200).json({
      success: true,
      message: "Added review successfully",
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const updateReviewController = async (req, res) => {
  const { comments, userId } = req.body;
  const { id } = req.params;
  const baseUrl = `${req.protocol}://${req.get("host")}`;
  const imageUrl = req.file ? `${baseUrl}/${req.file.filename}` : null;
  try {
    const result = await updateReviewByUserService(
      comments,
      id,
      userId,
      imageUrl
    );
    if (result.statusCode === 403) {
      return res.status(403).json({ success: false, message: "Forbbiden" });
    }
    if (!result) {
      return res
        .status(404)
        .json({ success: false, message: "User or product id not found" });
    }
    return res.status(200).json({
      success: true,
      message: "Updated review successfully",
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const deleteReviewController = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;
  try {
    const result = await deleteReviewService(id, userId);
    if (result.statusCode === 403) {
      return res.status(403).json({ success: false, message: "Forbbiden" });
    }
    if (!result) {
      return res
        .status(404)
        .json({ success: false, message: "User or product id not found" });
    }
    return res.status(200).json({
      success: true,
      message: "Deleted review successfully",
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

//reply
export const addReplyController = async (req, res) => {
  const { reviewId, userId, comments } = req.body;
  try {
    const result = await addReplyService(reviewId, userId, comments);
    return res.status(200).json({
      success: true,
      message: "Added reply successfully",
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const updateReplyController = async (req, res) => {
  const { id } = req.params;
  const { comments, userId } = req.body;
  try {
    const result = await updateReplyService(id, userId, comments);
    if (result.statusCode === 403) {
      return res.status(403).json({ success: false, message: "Forbbiden" });
    }
    if (!result) {
      return res
        .status(404)
        .json({ success: false, message: "Error something" });
    }
    return res.status(200).json({
      success: true,
      message: "Updated reply successfully",
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getRepliesByReviewController = async (req, res) => {
  const { reviewId } = req.params;
  const { page = 1, limit = 10 } = req.query;
  try {
    const result = await getReviewAndReplyService(reviewId, page, limit);
    return res.status(200).json({
      success: true,
      message: "Get replies successfully",
      data: result,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteReplyController = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;
  try {
    const result = await deleteReplyService(id, userId);
    if (result.statusCode === 403) {
      return res.status(403).json({ success: false, message: "Forbbiden" });
    }
    if (!result) {
      return res
        .status(404)
        .json({ success: false, message: "Reply id not found" });
    }
    return res.status(200).json({ success: true, message: "Reply deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
