"use strict";
import Reporte from "../entity/reporte.entity.js";
import Pedido from "../entity/pedido.entity.js";
import Inventario from "../entity/inventario.entity.js";
import Proveedor from "../entity/proveedor.entity.js";
import { AppDataSource } from "../config/configDb.js";
import { In } from "typeorm";

/**
 * Crea un nuevo reporte en la base de datos
 * @param {Object} body - Datos del reporte
 * @returns {Promise} Promesa con el objeto de reporte creado o un error
 */
async function createReporte(body) {
    try {
        const reporteRepository = AppDataSource.getRepository(Reporte);

        let newReporte = reporteRepository.create({
            titulo: body.titulo,
            descripcion: body.descripcion,
            tipo: body.tipo,
            estado: "pendiente",
            fecha_creacion: new Date(),
            datos: body.datos || {}
        });

        newReporte = await reporteRepository.save(newReporte);

        return [newReporte, null];
    } catch (error) {
        console.error("Error al crear reporte:", error);
        return [null, "Error interno del servidor"];
    }
}

/**
 * Obtiene un reporte por su ID, incluyendo relaciones opcionales
 * @param {Object} query - Parámetros de consulta (id)
 * @returns {Promise} Promesa con el objeto de reporte encontrado o un error
 */
async function getReporte(query) {
    try {
        const reporteRepository = AppDataSource.getRepository(Reporte);

        const reporteFound = await reporteRepository.findOne({
            where: { id: query.id },
            relations: ["pedido", "inventario", "proveedor"]
        });

        if (!reporteFound) return [null, "Reporte no encontrado"];

        return [reporteFound, null];
    } catch (error) {
        console.error("Error al obtener el reporte:", error);
        return [null, "Error interno del servidor"];
    }
}

/**
 * Obtiene todos los reportes de la base de datos, con opción a filtrar por estado o tipo
 * @param {Object} filters - Filtros de estado y tipo
 * @returns {Promise} Promesa con el array de reportes encontrados o un error
 */
async function getReportes(filters) {
    try {
        const reporteRepository = AppDataSource.getRepository(Reporte);

        const reportes = await reporteRepository.find({
            where: {
                ...(filters.estado && { estado: filters.estado }),
                ...(filters.tipo && { tipo: filters.tipo })
            },
            relations: ["pedido", "inventario", "proveedor"]
        });

        return reportes.length ? [reportes, null] : [null, "No se encontraron reportes"];
    } catch (error) {
        console.error("Error al obtener los reportes:", error);
        return [null, "Error interno del servidor"];
    }
}

/**
 * Actualiza un reporte por su ID en la base de datos
 * @param {Object} query - Parámetros de consulta (id)
 * @param {Object} body - Datos del reporte a actualizar
 * @returns {Promise} Promesa con el objeto de reporte actualizado o un error
 */
async function updateReporte(query, body) {
    try {
        const reporteRepository = AppDataSource.getRepository(Reporte);

        const reporteFound = await reporteRepository.findOne({ where: { id: query.id } });
        if (!reporteFound) return [null, "Reporte no encontrado"];

        await reporteRepository.update({ id: query.id }, {
            titulo: body.titulo,
            descripcion: body.descripcion,
            tipo: body.tipo,
            estado: body.estado,
            datos: body.datos || reporteFound.datos
        });

        const updatedReporte = await reporteRepository.findOne({ where: { id: query.id } });
        return updatedReporte ? [updatedReporte, null] : [null, "Error al actualizar el reporte"];
    } catch (error) {
        console.error("Error al actualizar reporte:", error);
        return [null, "Error interno del servidor"];
    }
}

/**
 * Cambia el estado de un reporte por su ID
 * @param {Object} query - Parámetros de consulta (id)
 * @param {String} nuevoEstado - Nuevo estado del reporte
 * @returns {Promise} Promesa con el reporte actualizado o un error
 */
async function updateEstadoReporte(query, nuevoEstado) {
    try {
        const reporteRepository = AppDataSource.getRepository(Reporte);

        const reporteFound = await reporteRepository.findOne({ where: { id: query.id } });
        if (!reporteFound) return [null, "Reporte no encontrado"];

        reporteFound.estado = nuevoEstado;
        await reporteRepository.save(reporteFound);

        return [reporteFound, null];
    } catch (error) {
        console.error("Error al cambiar el estado del reporte:", error);
        return [null, "Error interno del servidor"];
    }
}

/**
 * Elimina un reporte por su ID de la base de datos
 * @param {Object} query - Parámetros de consulta (id)
 * @returns {Promise} Promesa con el reporte eliminado o un error
 */
async function deleteReporte(query) {
    try {
        const reporteRepository = AppDataSource.getRepository(Reporte);

        const reporteFound = await reporteRepository.findOne({ where: { id: query.id } });
        if (!reporteFound) return [null, "Reporte no encontrado"];

        await reporteRepository.remove(reporteFound);

        return [reporteFound, null];
    } catch (error) {
        console.error("Error al eliminar el reporte:", error);
        return [null, "Error interno del servidor"];
    }
}

/**
 * Genera un informe resumido de todos los reportes agrupados por tipo
 * @returns {Promise} Promesa con el informe de reportes por tipo
 */
async function getReporteResumenPorTipo() {
    try {
        const reporteRepository = AppDataSource.getRepository(Reporte);

        const resumenPorTipo = await reporteRepository
            .createQueryBuilder("reporte")
            .select("reporte.tipo", "tipo")
            .addSelect("COUNT(reporte.id)", "cantidad")
            .groupBy("reporte.tipo")
            .getRawMany();

        return [resumenPorTipo, null];
    } catch (error) {
        console.error("Error al generar resumen de reportes:", error);
        return [null, "Error interno del servidor"];
    }
}

/**
 * Genera un informe de estados de reportes (cuántos reportes están en cada estado)
 * @returns {Promise} Promesa con el informe de estados de reportes
 */
async function getReporteEstados() {
    try {
        const reporteRepository = AppDataSource.getRepository(Reporte);

        const reporteEstados = await reporteRepository
            .createQueryBuilder("reporte")
            .select("reporte.estado", "estado")
            .addSelect("COUNT(reporte.id)", "cantidad")
            .groupBy("reporte.estado")
            .getRawMany();

        return [reporteEstados, null];
    } catch (error) {
        console.error("Error al obtener estados de reportes:", error);
        return [null, "Error interno del servidor"];
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
    getReporteEstados
};
