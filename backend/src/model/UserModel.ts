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
        idTicket: { type: Schema.Types.ObjectId, ref: "Ticket" },
        confirm: { type: Boolean, default: false },
        // createdAt: { type: Date, default: Date.now, expires: 300 },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const UserModel = mongoose.model("User", UserSchema);
