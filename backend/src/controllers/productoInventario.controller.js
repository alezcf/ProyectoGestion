"use strict";
import ProductoInventarioService from "../services/productoInventario.service.js";
import {
    handleErrorClient,
    handleErrorServer,
    handleSuccess
} from "../handlers/responseHandlers.js";

/**
 * Crea relaciones entre un producto y varios inventarios
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
export async function createProductoInventarios(req, res) {
    try {
        const { productoId, inventariosIds, cantidades } = req.body;
        console.log("Producto ID:", productoId);
        console.log("Inventarios IDs:", inventariosIds);
        console.log("Cantidades:", cantidades);
        const [relaciones, error] = await ProductoInventarioService
            .createProductoInventarios(productoId, inventariosIds, cantidades);
            console.log("dentro del catch" + error);
        if (error) return handleErrorClient(res, 400, error);
        console.log("dentro del catch" + error);
        handleSuccess(res, 201, "Relaciones creadas correctamente", relaciones);
    } catch (error) {
        console.log("dentro del catch" + error);
        handleErrorServer(res, 500, "Error creando relaciones producto-inventarios", error.message);
    }
}


/**
 * Obtiene todos los inventarios de un producto
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
export async function getInventariosByProducto(req, res) {
    try {
        const { productoId } = req.query;

        const [inventarios, error] = await ProductoInventarioService
            .getInventariosByProducto(productoId);
        if (error) return handleErrorClient(res, 404, error);

        handleSuccess(res, 200, "Inventarios encontrados", inventarios);
    } catch (error) {
        handleErrorServer(res, 500, "Error obteniendo inventarios de un producto", error.message);
    }
}

/**
 * Elimina todas las relaciones entre un producto y sus inventarios
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
export async function deleteInventarioByRelacionId(req, res) {
    try {
        const { relacionId } = req.query;

        if (!relacionId) {
            return handleErrorClient(res, 400, "ID de la relación es requerido");
        }

        const [resultado, error] = await ProductoInventarioService
            .deleteInventarioByRelacionId(relacionId);

        if (error) return handleErrorClient(res, 404, error);

        handleSuccess(res, 200, "Relación eliminada correctamente", resultado);
    } catch (error) {
        handleErrorServer(res, 500, "Error eliminando producto-inventario", error.message);
    }
}

/**
 * Actualiza las relaciones entre un producto y sus inventarios
 * Si la relación no existe, se crea automáticamente
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
export async function updateProductoInventarios(req, res) {
    try {
        console.log("Producto ID:", req.body.productoId);
        console.log("Inventarios IDs:", req.body.inventariosIds);
        console.log("Cantidades:", req.body.cantidades);
        const { productoId, inventariosIds, cantidades } = req.body;
        const [relacionesActualizadas, error] = await ProductoInventarioService
            .updateProductoInventarios(productoId, inventariosIds, cantidades);
            console.log(error);
        if (error) return handleErrorClient(res, 400, error);

        handleSuccess(res, 200, "Relaciones actualizadas correctamente", relacionesActualizadas);
    } catch (error) {
        handleErrorServer(
            res,
            500,
            "Error actualizando relaciones producto-inventarios",
            error.message
        );
    }
}

/**
 * Obtiene todos los productos asociados a un inventario
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
export async function getProductosByInventario(req, res) {
    try {
        const { inventarioId } = req.query;

        if (!inventarioId) {
            return handleErrorClient(res, 400, "ID del inventario es requerido");
        }

        const [productos, error] = await ProductoInventarioService
            .getProductosByInventario(inventarioId);

        if (error) return handleErrorClient(res, 404, error);

        handleSuccess(res, 200, "Productos asociados encontrados", productos);
    } catch (error) {
        console.error("Error al obtener productos por inventario:", error);
        handleErrorServer(
            res,
            500,
            "Error obteniendo productos asociados a un inventario",
            error.message
        );
    }
}

/**
 * Actualiza la cantidad de un producto en un inventario específico
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
export async function updateCantidadProductoInventario(req, res) {
    try {
        const { relacionId, nuevaCantidad } = req.body;

        if (!relacionId || nuevaCantidad === undefined) {
            return handleErrorClient(res, 400, "ID de la relación y la nueva cantidad son requeridos");
        }

        const [relacionActualizada, error] = await ProductoInventarioService.updateCantidadProductoInventario(
            relacionId,
            nuevaCantidad
        );

        if (error) return handleErrorClient(res, 400, error);

        handleSuccess(res, 200, "Cantidad actualizada correctamente", relacionActualizada);
    } catch (error) {
        handleErrorServer(res, 500, "Error actualizando la cantidad del producto-inventario", error.message);
    }
}

export default {
    createProductoInventarios,
    getInventariosByProducto,
    deleteInventarioByRelacionId,
    updateProductoInventarios,
    updateCantidadProductoInventario,
    getProductosByInventario
};
