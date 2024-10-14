"use strict";
import InventarioService from "../services/inventario.service.js";
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
        console.log(body);
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
 * Actualiza un inventario por su ID
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
export async function updateInventario(req, res) {
    try {
        const { id } = req.query;
        const { body } = req;

        const [
            inventario,
            errorInventario
        ] = await InventarioService.updateInventario({ id }, body);

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

        const [inventarioDelete, errorInventarioDelete] = await InventarioService.deleteInventario({
            id
        });

        if (errorInventarioDelete) return handleErrorClient(res, 404, errorInventarioDelete);

        handleSuccess(res, 200, "Inventario eliminado correctamente", inventarioDelete);
    } catch (error) {
        handleErrorServer(res, 500, "Error eliminando un inventario", error.message);
    }
}

export default {
    createInventario,
    getInventario,
    getInventarios,
    updateInventario,
    deleteInventario,
};
