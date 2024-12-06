"use strict";
import Reporte from "../entity/reporte.entity.js";
import Inventario from "../entity/inventario.entity.js";
import Producto from "../entity/producto.entity.js";
import { AppDataSource } from "../config/configDb.js";
import { In } from "typeorm";


/**
 * Crea o actualiza un reporte para evitar duplicados.
 * @param {Object} body - Datos del reporte
 * @returns {Promise} Promesa con el objeto de reporte creado o actualizado, o un error
 */
async function createOrUpdateReporte(body) {
    try {
        const reporteRepository = AppDataSource.getRepository(Reporte);
        const productoRepository = AppDataSource.getRepository(Producto);
        const inventarioRepository = AppDataSource.getRepository(Inventario);

        let producto = null;
        let inventario = null;
        console.log("Body datos producto id es: ", body.datos.productoId)
        if (body.datos.productoId) {
            producto = await productoRepository.findOne({ where: { id: body.datos.productoId } });
            if (!producto) return [null, "El producto especificado no existe"];
        }

        if (body.datos.inventarioId) {
            inventario = await inventarioRepository.findOne({ where: { id: body.datos.inventarioId } });
            if (!inventario) return [null, "El inventario especificado no existe"];
        }

        console.log("Creando o actualizando reporte con datos:", body);
        console.log("Producto:", producto);
        console.log("Inventario:", inventario);
        const newReporte = reporteRepository.create({
            titulo: body.titulo,
            descripcion: body.descripcion,
            tipo: body.tipo,
            estado: "pendiente",
            fecha_creacion: new Date(),
            datos: body.datos,
            producto,
            inventario,
        });

        const savedReporte = await reporteRepository.save(newReporte);
        return [savedReporte, null];
    } catch (error) {
        console.error("Error al crear o actualizar reporte:", error);
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
        console.log("Peticion de obtener reporte específico con id ", query.id);
        const reporteFound = await reporteRepository.findOne({
            where: { id: query.id },
            relations: ["inventario", "producto"]
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
            relations: ["inventario", "producto"]
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

/**
 * Busca un reporte por datos específicos
 * @param {Object} datos - Información de búsqueda
 * @returns {Promise} Retorna el reporte encontrado o null
 */
async function getReportePorDatos(datos) {
    try {
        const reporteRepository = AppDataSource.getRepository(Reporte);
        const reporte = await reporteRepository
            .createQueryBuilder("reporte")
            .where("CAST(reporte.datos AS TEXT) = :datos", { datos: JSON.stringify(datos) })
            .getOne();
        return reporte;
    } catch (error) {
        console.error("Error al buscar reporte por datos:", error);
        return null;
    }
}

async function deleteAllPendingReportes() {
    const reporteRepository = AppDataSource.getRepository(Reporte);
    await reporteRepository.delete({ estado: "pendiente" });
}

export default {
    createOrUpdateReporte,
    getReporte,
    getReportes,
    updateReporte,
    updateEstadoReporte,
    deleteReporte,
    deleteAllPendingReportes,
    getReporteResumenPorTipo,
    getReporteEstados,
    getReportePorDatos,
};
