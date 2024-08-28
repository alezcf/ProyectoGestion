"use strict";
import { Router } from "express";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import {
    createProducto,
    deleteProducto,
    getProducto,
    getProductos,
    updateProducto,
} from "../controllers/producto.controller.js";

const router = Router();

router
    .use(authenticateJwt);

router
    .get("/", getProductos)
    .get("/detail", getProducto)
    .put("/", updateProducto)
    .delete("/", deleteProducto)
    .post("/", createProducto);

export default router;
