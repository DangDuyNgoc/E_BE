import mongoose from "mongoose";

const orderDetailSchema = new mongoose.Schema(
  {
    order_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "orders",
      required: true,
    },
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
      required: true,
    },
    color: {
      type: String,
    },
    quantity: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    discountedPrice: {
      type: Number,
    },
  },
  { timestamps: true },
);

const orderDetailModel = mongoose.model("order_details", orderDetailSchema);

export default orderDetailModel;
