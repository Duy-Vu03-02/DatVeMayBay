import express from "express";
import UserRoutes from "./UserRoutes";

const router = express.Router();

export default (): express.Router => {
  UserRoutes(router);
  return router;
};
