import mongoose, { Schema } from "mongoose";

const TicketSchema = new Schema(
  {
    timeStart: { type: Date, required: true, select: true },
    from: { type: String, required: true, select: true },
    to: { type: String, required: true, select: true },
    quantity: { type: Number, require: true, select: true, default: 10 },
    page: { type: Number, require: true, select: true },
  },
  {
    timestamps: true,
  }
);

export const TicketModel = mongoose.model("Ticket", TicketSchema);
