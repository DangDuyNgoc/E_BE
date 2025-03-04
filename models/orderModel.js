import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELED"],
      default: "PENDING",
    },
    total_amount: {
      type: Number,
      required: true,
    },
    payment_status: {
      type: String,
      enum: ["PENDING", "PAID", "FAILED"],
      default: "PENDING",
    },
    payment_intent_id: {
      type: String,
    },
    shipping_address: {
      address: {
        type: String,
        required: true,
      },
      status: {
        type: String,
        enum: ["PENDING", "SHIPPED", "DELIVERED"],
        default: "PENDING",
      },
      tracking_number: String,
      estimated_delivery: Date,
    },
    order_details: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "order_details",
      },
    ],
  },
  { timestamps: true }
);

const orderModel = mongoose.model("orders", orderSchema);

export default orderModel;
