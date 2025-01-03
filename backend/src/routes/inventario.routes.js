"use strict";
import { Router } from "express";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import {
    createInventario,
    deleteInventario,
    getCantidadProductosPorCategoria,
    getInventario,
    getInventarios,
    getInventarioStock,
    updateInventario,
} from "../controllers/inventario.controller.js";

const router = Router();

router
    .use(authenticateJwt);

router
    .post("/", createInventario)
    .get("/", getInventarios)
    .get("/detail", getInventario)
    .get("/detailCategorias", getCantidadProductosPorCategoria)
    .get("/detailStock", getInventarioStock)
    .put("/", updateInventario)
    .delete("/", deleteInventario);

export default router;
