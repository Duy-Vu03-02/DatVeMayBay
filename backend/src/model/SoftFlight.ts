import mongoose, { Schema } from "mongoose";

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
    createdAt: { type: Date, default: Date.now, expires: 300 },
    confirm: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export const SoftFlightModel = mongoose.model("SoftFlight", SoftFlightSchema);
