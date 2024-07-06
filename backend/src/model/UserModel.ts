import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema(
  {
    username: { type: String, required: true, select: true },
    account: { type: String, require: true, select: false },
    authentication: {
      password: { type: String, require: true, select: false },
      token: { type: String, require: false, select: false },
    },
    phone: { type: Number, require: true, select: true },
    flight: { type: [Schema.ObjectId], require: false, select: true },
  },
  {
    timestamps: true,
  }
);

export const UserModel = mongoose.model("User", UserSchema);
