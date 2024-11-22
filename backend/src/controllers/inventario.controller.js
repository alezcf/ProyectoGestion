"use strict";
import InventarioService from "../services/inventario.service.js";
import {
    inventarioBodyValidation,
    inventarioQueryValidation
} from "../validations/inventario.validation.js";
import {
    handleErrorClient,
    handleErrorServer,
    handleSuccess
} from "../handlers/responseHandlers.js";

/**
 * Crea un nuevo inventario
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
export async function createInventario(req, res) {
    try {
        const { body } = req;
        const { error } = inventarioBodyValidation.validate(body);

        if(error) return handleErrorClient(res, 400, "Error de validación", error.message);
        const [inventario, errorInventario] = await InventarioService.createInventario(body);

        if (errorInventario) return handleErrorClient(res, 400, errorInventario);

        handleSuccess(res, 201, "Inventario creado correctamente", inventario);
    } catch (error) {
        handleErrorServer(res, 500, "Error creando un inventario", error.message);
    }
}

/**
 * Obtiene un inventario por su ID
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
export async function getInventario(req, res) {
    try {
        const { id } = req.query;
        console.log("get inventario especifico");
        const [inventario, errorInventario] = await InventarioService.getInventario({ id });

        if (errorInventario) return handleErrorClient(res, 404, errorInventario);

        handleSuccess(res, 200, "Inventario encontrado", inventario);
    } catch (error) {
        handleErrorServer(res, 500, "Error obteniendo un inventario", error.message);
    }
}

/**
 * Obtiene todos los inventarios
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
export async function getInventarios(req, res) {
    try {
        const [inventarios, errorInventarios] = await InventarioService.getInventarios();

        if (errorInventarios) return handleErrorClient(res, 404, errorInventarios);

        handleSuccess(res, 200, "Inventarios encontrados", inventarios);
    } catch (error) {
        handleErrorServer(res, 500, "Error obteniendo los inventarios", error.message);
    }
}

/**
 * Obtiene el nivel de stock actual y máximo para cada inventario
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
export async function getInventarioStock(req, res) {
    try {
        const [data, error] = await InventarioService.getInventarioStock();

        if (error) return handleErrorClient(res, 500, "Error al obtener inventario y stock", error);

        handleSuccess(res, 200, "Inventarios y stock obtenidos correctamente", data);
    } catch (error) {
        handleErrorServer(res, 500, "Error obteniendo inventarios y stock", error.message);
    }
}

/**
 * Obtiene la cantidad de productos por categoría
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
export async function getCantidadProductosPorCategoria(req, res) {
    try {
        const [data, error] = await InventarioService.getCantidadProductosPorCategoria();

        if (error) {
            return handleErrorClient(
                res,
                500,
                "Error al obtener productos por categoría",
                error
            );
        }

        handleSuccess(res, 200, "Cantidad de productos por categoría obtenida correctamente", data);
    } catch (error) {
        handleErrorServer(res, 500, "Error obteniendo productos por categoría", error.message);
    }
}

/**
 * Actualiza un inventario por su ID
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
export async function updateInventario(req, res) {
    try {
        const { id } = req.query;

        if (!id) return handleErrorClient(res, 400, "Error de validación", "El ID es obligatorio.");

        const { body } = req;
        const { error } = inventarioBodyValidation.validate(body);

        if(error) return handleErrorClient(res, 400, "Error de validación", error.message);

        const [
            inventario,
            errorInventario
        ] = await InventarioService.updateInventario({ id }, body);

        if (
            errorInventario === "Inventario no encontrado"
            || errorInventario === "Los productos solicitados por ingresar no existen."
        )
            return handleErrorClient(res, 404, errorInventario);



        if (errorInventario) return handleErrorClient(res, 400, errorInventario);

        handleSuccess(res, 200, "Inventario actualizado correctamente", inventario);
    } catch (error) {
        handleErrorServer(res, 500, "Error modificando un inventario", error.message);
    }
}

/**
 * Elimina un inventario por su ID
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
export async function deleteInventario(req, res) {
    try {
        const { id } = req.query;
        if (!id) return handleErrorClient(res, 400, "Error de validación", "El ID es obligatorio.");

        const [inventarioDelete, errorInventarioDelete] = await InventarioService.deleteInventario({
            id
        });

        if (errorInventarioDelete === "Inventario no encontrado"){
                return handleErrorClient(res, 404, errorInventarioDelete);
        }

        if(errorInventarioDelete) return handleErrorClient(res, 400, errorInventarioDelete);

        handleSuccess(res, 200, "Inventario eliminado correctamente", inventarioDelete);
    } catch (error) {
        handleErrorServer(res, 500, "Error eliminando un inventario", error.message);
    }
}

export default {
    createInventario,
    getInventario,
    getInventarios,
    getInventarioStock,
    updateInventario,
    deleteInventario,
};
