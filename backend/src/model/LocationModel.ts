import mongoose, { Schema } from "mongoose";

const LocationSchema = new Schema({
  name: { type: String, required: true, select: true },
});

export const LocationModel = mongoose.model("Location", LocationSchema);
