"use strict";
import { Router } from "express";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import {
    createProductoProveedores,
    deleteProveedorByRelacionId,
    getProveedoresByProducto,
    updateProductoProveedores
} from "../controllers/productoProveedor.controller.js";

const router = Router();

router
    .use(authenticateJwt);

router
    .post("/", createProductoProveedores)
    .put("/", updateProductoProveedores)
    .get("/", getProveedoresByProducto)
    .delete("/", deleteProveedorByRelacionId);

export default router;
