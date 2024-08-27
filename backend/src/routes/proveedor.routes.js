"use strict";
import { Router } from "express";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import {
    createProveedor,
    deleteProveedor,
    getProveedor,
    getProveedores,
    updateProveedor,
} from "../controllers/proveedor.controller.js";

const router = Router();

router
    .use(authenticateJwt);

router
    .get("/", getProveedores)
    .get("/detail", getProveedor)
    .put("/", updateProveedor)
    .delete("/", deleteProveedor)
    .post("/", createProveedor);

export default router;
