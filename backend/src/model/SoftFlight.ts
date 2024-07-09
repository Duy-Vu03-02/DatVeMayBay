import mongoose, { Schema } from "mongoose";
import { THANH_TOAN } from "../controller/TicketController";

const SoftFlightSchema = new Schema(
  {
    idUser: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      select: true,
    },
    idTicket: {
      type: Schema.Types.ObjectId,
      ref: "Ticket",
      required: true,
      select: true,
    },
    state: { type: String, default: THANH_TOAN, select: true, required: true },
    createdAt: { type: Date, default: Date.now, expires: 300, select: true },
    confirm: { type: Boolean, default: false, select: true },
  },
  {
    timestamps: true,
  }
);

export const SoftFlightModel = mongoose.model("SoftFlight", SoftFlightSchema);
