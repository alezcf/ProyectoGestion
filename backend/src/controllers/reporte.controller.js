"use strict";
import ReporteService from "../services/reporte.service.js";
import monitorInventariosYProductos from "../business/monitorInventario.js";
import {
    handleErrorClient,
    handleErrorServer,
    handleSuccess
} from "../handlers/responseHandlers.js";

/**
 * Crea un nuevo reporte
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
export async function createReporte(req, res) {
    try {
        const { body } = req;
        const [reporte, errorReporte] = await ReporteService.createOrUpdateReporte(body);

        if (errorReporte) return handleErrorClient(res, 400, errorReporte);

        handleSuccess(res, 201, "Reporte creado correctamente", reporte);
    } catch (error) {
        handleErrorServer(res, 500, "Error creando un reporte", error.message);
    }
}

/**
 * Obtiene un reporte por su ID
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
export async function getReporte(req, res) {
    try {
        const { id } = req.query;

        const [reporte, errorReporte] = await ReporteService.getReporte({ id });

        if (errorReporte) return handleErrorClient(res, 404, errorReporte);

        handleSuccess(res, 200, "Reporte encontrado", reporte);
    } catch (error) {
        handleErrorServer(res, 500, "Error obteniendo un reporte", error.message);
    }
}

/**
 * Obtiene todos los reportes
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
export async function getReportes(req, res) {
    try {
        const { estado, tipo } = req.query; // Filtros opcionales
        const [reportes, errorReportes] = await ReporteService.getReportes({ estado, tipo });

        if (errorReportes) return handleErrorClient(res, 404, errorReportes);

        handleSuccess(res, 200, "Reportes encontrados", reportes);
    } catch (error) {
        handleErrorServer(res, 500, "Error obteniendo los reportes", error.message);
    }
}

/**
 * Actualiza un reporte por su ID
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
export async function updateReporte(req, res) {
    try {
        const { id } = req.query;
        const { body } = req;

        const [reporte, errorReporte] = await ReporteService.updateReporte({ id }, body);

        if (errorReporte) return handleErrorClient(res, 400, errorReporte);

        handleSuccess(res, 200, "Reporte actualizado correctamente", reporte);
    } catch (error) {
        handleErrorServer(res, 500, "Error modificando un reporte", error.message);
    }
}

/**
 * Cambia el estado de un reporte por su ID
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
export async function updateEstadoReporte(req, res) {
    try {
        const { id } = req.query;
        const { estado } = req.body;

        const [reporte, errorReporte] = await ReporteService.updateEstadoReporte({ id }, estado);

        if (errorReporte) return handleErrorClient(res, 400, errorReporte);

        handleSuccess(res, 200, "Estado del reporte actualizado correctamente", reporte);
    } catch (error) {
        handleErrorServer(res, 500, "Error actualizando el estado del reporte", error.message);
    }
}

/**
 * Elimina un reporte por su ID
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
export async function deleteReporte(req, res) {
    try {
        const { id } = req.query;

        const [reporteDelete, errorReporteDelete] = await ReporteService.deleteReporte({ id });

        if (errorReporteDelete) return handleErrorClient(res, 404, errorReporteDelete);

        handleSuccess(res, 200, "Reporte eliminado correctamente", reporteDelete);
    } catch (error) {
        handleErrorServer(res, 500, "Error eliminando un reporte", error.message);
    }
}

/**
 * Obtiene un resumen de reportes agrupados por tipo
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
export async function getReporteResumenPorTipo(req, res) {
    try {
        const [resumen, errorResumen] = await ReporteService.getReporteResumenPorTipo();

        if (errorResumen) return handleErrorClient(res, 500, errorResumen);

        handleSuccess(res, 200, "Resumen de reportes por tipo obtenido correctamente", resumen);
    } catch (error) {
        handleErrorServer(res, 500, "Error obteniendo resumen de reportes por tipo", error.message);
    }
}

/**
 * Obtiene el conteo de reportes agrupados por estado
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
export async function getReporteEstados(req, res) {
    try {
        const [reporteEstados, errorEstados] = await ReporteService.getReporteEstados();

        if (errorEstados) return handleErrorClient(res, 500, errorEstados);

        handleSuccess(
            res,
            200,
            "Conteo de reportes por estado obtenido correctamente",
            reporteEstados
        );
    } catch (error) {
        handleErrorServer(
            res, 500, "Error obteniendo conteo de reportes por estado", error.message
        );
    }
}

export async function testMonitorInventarios(req, res) {
    try {
        await monitorInventariosYProductos();
        handleSuccess(res, 200, "Monitoreo de inventarios y productos ejecutado manualmente");
    } catch (error) {
        handleErrorServer(res, 500, "Error ejecutando el monitoreo de inventarios", error.message);
    }
}

export default {
    createReporte,
    getReporte,
    getReportes,
    updateReporte,
    updateEstadoReporte,
    deleteReporte,
    getReporteResumenPorTipo,
    getReporteEstados,
    testMonitorInventarios,
};
