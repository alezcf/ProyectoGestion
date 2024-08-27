"use strict";
import { Router } from "express";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import {
    createVendedor,
    deleteVendedor,
    getVendedor,
    getVendedores,
    updateVendedor,
} from "../controllers/vendedor.controller.js";

const router = Router();

router
    .use(authenticateJwt);

router
    .get("/", getVendedores)
    .get("/detail", getVendedor)
    .put("/", updateVendedor)
    .delete("/", deleteVendedor)
    .post("/", createVendedor);

export default router;
