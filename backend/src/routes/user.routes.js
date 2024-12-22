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
  toggleUserActiveById,
  updateUser,
} from "../controllers/user.controller.js";

const router = Router();

// Rutas públicas
router.post("/reset-password", resetPassword);

// Rutas protegidas por autenticación
router.use(authenticateJwt);

router
  .get("/", getUsers)
  .get("/detail/", getUser);

router
  .put("/", isAdmin, updateUser)
  .delete("/", isAdmin, deleteUser)
  .post("/", isAdmin, createUser)
  .post("/statusUser", isAdmin, toggleUserActiveById);

export default router;
