"use strict";
import { Router } from "express";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import {
    createPedido,
    deletePedido,
    getPedido,
    getPedidos,
    updatePedido,
} from "../controllers/pedido.controller.js";

const router = Router();

router
    .use(authenticateJwt);

router
    .post("/", createPedido)
    .get("/", getPedidos)
    .get("/detail", getPedido)
    .put("/", updatePedido)
    .delete("/", deletePedido);

export default router;