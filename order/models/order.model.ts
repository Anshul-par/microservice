import { Schema, model } from "mongoose";

const orderSchema = new Schema(
  {
    ticketId: { type: Schema.Types.ObjectId, ref: "ticket", required: true },
    status: {
      type: String,
      enum: ["created", "complete", "awaiting:payment", "canceled"],
      default: "created",
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const OrderModel = model("order", orderSchema);

export { OrderModel };
