"use strict";
import { Router } from "express";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { getConstantsProducto } from "../controllers/constants.controller.js";

const router = Router();

router
    .use(authenticateJwt);

router
    .get("/", getConstantsProducto);

export default router;