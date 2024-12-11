"use strict";
import { Router } from "express";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import {
    createProductoProveedores,
    deleteProveedorByRelacionId,
    getProductosByProveedor,
    getProveedoresByProducto,
    updateProductoProveedores,
} from "../controllers/productoProveedor.controller.js";

const router = Router();

router
    .use(authenticateJwt);

router
    .post("/", createProductoProveedores)
    .put("/", updateProductoProveedores)
    .get("/", getProveedoresByProducto)
    .get("/proveedor-producto", getProductosByProveedor)
    .delete("/", deleteProveedorByRelacionId);

export default router;
