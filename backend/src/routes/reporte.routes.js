"use strict";
import { Router } from "express";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import {
    createReporte,
    deleteReporte,
    getReporte,
    getReporteEstados,
    getReporteResumenPorTipo,
    getReportes,
    updateEstadoReporte,
    updateReporte
} from "../controllers/reporte.controller.js";

const router = Router();

router
    .use(authenticateJwt);

router
    .post("/", createReporte)                // Crear un nuevo reporte
    .get("/", getReportes)                   // Obtener todos los reportes (opcionalmente filtrados)
    .get("/detail", getReporte)              // Obtener un reporte específico por ID
    .put("/", updateReporte)                 // Actualizar un reporte completo
    .put("/estado", updateEstadoReporte)     // Actualizar solo el estado de un reporte
    .delete("/", deleteReporte)              // Eliminar un reporte específico por ID
    .get("/resumen/tipo", getReporteResumenPorTipo) // Obtener resumen de reportes por tipo
    .get("/estados", getReporteEstados);     // Obtener conteo de reportes por estado

export default router;
