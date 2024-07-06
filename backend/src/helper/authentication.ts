import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const genderPassword = async (password: string) => {
  try {
    const round = 9;
    const slat = await bcrypt.genSalt(round);
    const passHash = await bcrypt.hash(password, slat);
    return passHash;
  } catch (err) {
    console.error(err);
    return false;
  }
};

export const verifyPassword = async (inputPass: string, passDB: string) => {
  try {
    const result = await bcrypt.compare(inputPass, passDB);
    if (result) {
      return true;
    }
    return false;
  } catch (err) {
    console.error(err);
    return false;
  }
};

export const genderToken = async (payload: any) => {
  try {
    const accessSecret = process.env.ACCESS_TOKEN_JWT;
    const token = await jwt.sign(payload, accessSecret, {
      expiresIn: "1h",
    });
    return token;
  } catch (err) {
    console.error(err);
    return false;
  }
};

export const verifyToken = async (token: string) => {
  try {
    const accessSecret = process.env.ACCESS_TOKEN_JWT;
    if (token !== null) {
      const result = await jwt.verify(token, accessSecret);
      if (result) {
        return true;
      }
    }
    return false;
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      throw new Error(err.name);
    }
    console.error(err);
    return false;
  }
};
