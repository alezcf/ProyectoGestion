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

        const posiblesErrores = [
            "Los productos ingresados no existen.",
            "El proveedor ingresado no existe.",
            "El inventario ingresado no existe."
        ];

        if (posiblesErrores.includes(errorPedido)) {
            return handleErrorClient(res, 404, errorPedido);
        }


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
 * Obtiene el conteo de pedidos agrupados por estado
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
export async function getPedidosPorEstado(req, res) {
    try {
        const [pedidosPorEstado, error] = await PedidoService.getPedidosPorEstado();

        if (error) return handleErrorClient(res, 500, "Error al obtener pedidos por estado", error);

        handleSuccess(
            res,
            200,
            "Pedidos agrupados por estado obtenidos correctamente",
            pedidosPorEstado
        );
    } catch (error) {
        handleErrorServer(res, 500, "Error obteniendo pedidos por estado", error.message);
    }
}

/**
 * Obtiene la frecuencia de pedidos y volumen de productos adquiridos agrupados por proveedor
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
export async function getPedidosPorProveedor(req, res) {
    try {
        const [data, error] = await PedidoService.getPedidosPorProveedor();

        if (error) {
            return handleErrorClient(
                res,
                500,
                "Error al obtener pedidos por proveedor",
                error
            );
        }

        handleSuccess(res, 200, "Informe de pedidos por proveedor obtenido correctamente", data);
    } catch (error) {
        handleErrorServer(
            res,
            500,
            "Error obteniendo informe de pedidos por proveedor",
            error.message
        );
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
        console.log(body);
        console.log(id);
        const { error: queryError } = pedidoQueryValidation.validate({ id });

        if (queryError) {
            return handleErrorClient(res, 400, "Error de validación", queryError.message);
        }
        console.log(body);
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

        const error = pedidoQueryValidation.validate({ id });

        if (error) {
            return handleErrorClient(res, 400, "Error de validación en la ID.", error.message);
        }

        const [pedidoDeleted, errorPedidoDeleted] = await PedidoService.deletePedido({ id });

        if ( errorPedidoDeleted ) return handleErrorClient(res, 404, errorPedidoDeleted);

        handleSuccess(res, 200, "Pedido eliminado correctamente", pedidoDeleted);
    } catch (error) {
        handleErrorServer(res, 500, "Error eliminando un pedido", error.message);
    }
}

/**
 * Obtiene la tendencia de reposición de productos por categoría basada en los pedidos
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
export async function getTendenciaReposicionPorCategoria(req, res) {
    try {
        const [data, error] = await PedidoService.getTendenciaReposicionPorCategoria();

        if (error) {
            return handleErrorClient(
                res,
                500,
                "Error al obtener la tendencia de reposición por categoría",
                error
            );
        }

        handleSuccess(res, 200, "Tendencia por categoría obtenida correctamente", data);
    } catch (error) {
        handleErrorServer(
            res,
            500,
            "Error obteniendo la tendencia de reposición por categoría",
            error.message
        );
    }
}

export default {
    createPedido,
    getPedido,
    getPedidos,
    getPedidosPorEstado,
    getPedidosPorProveedor,
    getTendenciaReposicionPorCategoria,
    updatePedido,
    deletePedido,
};
