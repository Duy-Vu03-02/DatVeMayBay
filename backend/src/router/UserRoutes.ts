import { register, login, loginByToken } from "../controller/UserController";
import express from "express";

export default (router: express.Router) => {
  router.post("/auth/user/login", login);
  router.post("/auth/user/loginByToken", loginByToken);
  router.post("/auth/user/register", register);
};
