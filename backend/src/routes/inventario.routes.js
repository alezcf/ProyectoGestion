"use strict";
import { Router } from "express";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import {
    createInventario,
    deleteInventario,
    getInventario,
    getInventarios,
    updateInventario,
} from "../controllers/inventario.controller.js";

const router = Router();

router
    .use(authenticateJwt);

router
    .post("/", createInventario)
    .get("/", getInventarios)
    .get("/detail", getInventario)
    .put("/", updateInventario)
    .delete("/", deleteInventario);

export default router;
