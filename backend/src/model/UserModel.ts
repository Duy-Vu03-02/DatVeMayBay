import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema(
  {
    username: { type: String, required: true, select: true },
    account: { type: String, require: true, select: false },
    authentication: {
      password: { type: String, required: true, select: false },
    },
    phone: { type: String, require: true, select: true },
    flight: [
      {
        idTicket: { type: Schema.Types.ObjectId, ref: "Ticket", select: true },
        idSoftFlight: {
          type: Schema.Types.ObjectId,
          ref: "SoftFlight",
          select: true,
        },
        confirm: { type: Boolean, default: false, select: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const UserModel = mongoose.model("User", UserSchema);
