"use strict";
import { Router } from "express";
import { isAdmin } from "../middlewares/authorization.middleware.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import {
  createUser,
  deleteUser,
  getUser,
  getUsers,
  resetPassword,
  updateUser,
} from "../controllers/user.controller.js";

const router = Router();

router.post("/reset-password", resetPassword);

router
  .use(authenticateJwt)
  .use(isAdmin);

router
  .get("/", getUsers)
  .get("/detail/", getUser)
  .put("/", updateUser)
  .delete("/", deleteUser)
  .post("/", createUser);



export default router;
