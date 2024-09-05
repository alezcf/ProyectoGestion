"use strict";
import { Router } from "express";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import upload from "../config/configMulter.js";
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
    .put("/", upload.single("imagen"), updateProducto)
    .delete("/", deleteProducto)
    .post("/", upload.single("imagen"), createProducto);

export default router;