import mongoose from "mongoose";

const reviewsSchema = new mongoose.Schema(
  {
    comments: {
      type: String,
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "products",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    image: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true },
);

const reviewModel = mongoose.model("reviews", reviewsSchema);
export default reviewModel;
