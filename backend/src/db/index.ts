import mongoose from "mongoose";

export const connectionDB = async () => {
  try {
    const baseUrl = process.env.URL_MONGODB;
    await mongoose.connect(baseUrl, {});
    console.log("Connect DB:: Success");
  } catch (err) {
    console.error(err);
    throw new err();
  }
};
