"use strict";
import { Router } from "express";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import {
    createProductoInventarios,
    deleteInventarioByRelacionId,
    getInventariosByProducto,
    getProductosByInventario,
    updateCantidadProductoInventario,
    updateProductoInventarios
} from "../controllers/productoInventario.controller.js";

const router = Router();

router
    .use(authenticateJwt);

router
    .post("/", createProductoInventarios)
    .put("/", updateProductoInventarios)
    .patch("/", updateCantidadProductoInventario)
    .get("/", getInventariosByProducto)
    .get("/", getProductosByInventario)
    .delete("/", deleteInventarioByRelacionId);

export default router;
