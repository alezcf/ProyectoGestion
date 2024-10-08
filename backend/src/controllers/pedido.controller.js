"use strict";
import PedidoService from "../services/pedido.service.js";
import {
    pedidoBodyValidation,
    pedidoQueryValidation
} from "../validations/pedido.validation.js";
import {
    handleErrorClient,
    handleErrorServer,
    handleSuccess
} from "../handlers/responseHandlers.js";

/**
 * Crea un nuevo pedido
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
export async function createPedido(req, res) {
    try {
        const { body } = req;
        const { error } = pedidoBodyValidation.validate(body);

        if (error) return handleErrorClient(res, 400, "Error de validación", error.message);

        const [pedido, errorPedido] = await PedidoService.createPedido(body);

        if (errorPedido) return handleErrorClient(res, 400, errorPedido);

        handleSuccess(res, 201, "Pedido creado correctamente", pedido);
    } catch (error) {
        handleErrorServer(res, 500, "Error creando un pedido", error.message);
    }
}

/**
 * Obtiene un pedido por su ID
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
export async function getPedido(req, res) {
    try {
        const { id } = req.query;
        const { error } = pedidoQueryValidation.validate({ id });

        if (error) return handleErrorClient(res, 400, "Error de validación", error.message);

        const [pedido, errorPedido] = await PedidoService.getPedido({ id });

        if (errorPedido) return handleErrorClient(res, 404, errorPedido);

        handleSuccess(res, 200, "Pedido encontrado", pedido);
    } catch (error) {
        handleErrorServer(res, 500, "Error obteniendo un pedido", error.message);
    }
}

/**
 * Obtiene todos los pedidos
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
export async function getPedidos(req, res) {
    try {
        const [pedidos, errorPedidos] = await PedidoService.getPedidos();

        if (errorPedidos) return handleErrorClient(res, 404, errorPedidos);

        handleSuccess(res, 200, "Pedidos encontrados", pedidos);
    } catch (error) {
        handleErrorServer(res, 500, "Error obteniendo los pedidos", error.message);
    }
}

/**
 * Actualiza un pedido por su ID
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
export async function updatePedido(req, res) {
    try {
        const { id } = req.query;
        const { body } = req;

        const { error: queryError } = pedidoQueryValidation.validate({ id });

        if (queryError) {
            return handleErrorClient(res, 400, "Error de validación", queryError.message);
        }

        const { error: bodyError } = pedidoBodyValidation.validate(body);

        if (bodyError) return handleErrorClient(res, 400, "Error de validación", bodyError.message);

        const [pedido, errorPedido] = await PedidoService.updatePedido({ id }, body);

        if (errorPedido) return handleErrorClient(res, 400, errorPedido);

        handleSuccess(res, 200, "Pedido modificado correctamente", pedido);
    } catch (error) {
        handleErrorServer(res, 500, "Error modificando un pedido", error.message);
    }
}

/**
 * Elimina un pedido por su ID
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
export async function deletePedido(req, res) {
    try {
        const { id } = req.query;

        const { error: queryError } = pedidoQueryValidation.validate({ id });

        if (queryError) {
            return handleErrorClient(res, 400, "Error de validación", queryError.message);
        }

        const [pedidoDeleted, errorPedidoDeleted] = await PedidoService.deletePedido({ id });

        if (errorPedidoDeleted) return handleErrorClient(res, 404, errorPedidoDeleted);

        handleSuccess(res, 200, "Pedido eliminado correctamente", pedidoDeleted);
    } catch (error) {
        handleErrorServer(res, 500, "Error eliminando un pedido", error.message);
    }
}

export default {
    createPedido,
    getPedido,
    getPedidos,
    updatePedido,
    deletePedido,
};
