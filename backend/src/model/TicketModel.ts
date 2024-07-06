import mongoose, { Schema } from "mongoose";

const TicketSchema = new Schema(
  {
    timeStart: { type: Date, required: true, select: true },

    from: {
      idLocation: {
        type: Schema.Types.ObjectId,
        ref: "Location",
        required: true,
        select: true,
      },
      name: { type: String, required: true, select: true },
    },

    to: {
      idLocation: {
        type: Schema.Types.ObjectId,
        ref: "Location",
        required: true,
        select: true,
      },
      name: { type: String, required: true, select: true },
    },

    quantity: { type: Number, require: true, select: true, default: 10 },
  },
  {
    timestamps: true,
  }
);

export const TicketModel = mongoose.model("Ticket", TicketSchema);
