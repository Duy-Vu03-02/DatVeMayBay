import mongoose from "mongoose";

export const connectionDB = async () => {
  try {
    const baseUrl = process.env.URL_MONGODB;
    console.log(baseUrl);
    await mongoose.connect(baseUrl, {});
    console.log("Connext DB:: Success");
  } catch (err) {
    console.error(err);
    throw new err();
  }
};
