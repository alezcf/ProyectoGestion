"use strict";
import ProductoProveedorService from "../services/productoProveedor.service.js";
import { productoProveedoresValidation } from "../validations/productoProveedor.validation.js";
import {
    handleErrorClient,
    handleErrorServer,
    handleSuccess
} from "../handlers/responseHandlers.js";

/**
 * Crea relaciones entre un producto y varios proveedores
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
export async function createProductoProveedores(req, res) {
    try {
        const { productoId, proveedoresIds } = req.body;
        const [relaciones, error] = await ProductoProveedorService
            .createProductoProveedores(productoId, proveedoresIds);
        if (error) return handleErrorClient(res, 400, error);

        handleSuccess(res, 201, "Relaciones creadas correctamente", relaciones);
    } catch (error) {
        handleErrorServer(res, 500, "Error creando relaciones producto-proveedores", error.message);
    }
}

/**
 * Obtiene todos los proveedores de un producto
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
export async function getProveedoresByProducto(req, res) {
    try {
        const { productoId } = req.query;

        const [proveedores, error] = await ProductoProveedorService
            .getProveedoresByProducto(productoId);
        if (error) return handleErrorClient(res, 404, error);

        handleSuccess(res, 200, "Proveedores encontrados", proveedores);
    } catch (error) {
        handleErrorServer(res, 500, "Error obteniendo proveedores de un producto", error.message);
    }
}

/**
 * Elimina todas las relaciones entre un producto y sus proveedores
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
export async function deleteProveedorByRelacionId(req, res) {
    try {
        const { relacionId } = req.query;

        if (!relacionId) {
            return handleErrorClient(res, 400, "ID de la relación es requerido");
        }

        // Llamamos al servicio que elimina la relación por su ID
        const [resultado, error] = await ProductoProveedorService.deleteProveedorByRelacionId(relacionId);

        if (error) return handleErrorClient(res, 404, error); 

        // Enviar respuesta de éxito si la eliminación fue exitosa
        handleSuccess(res, 200, "Relación eliminada correctamente", resultado);
    } catch (error) {
        handleErrorServer(res, 500, "Error eliminando la relación producto-proveedor", error.message);
    }
}


/**
 * Actualiza las relaciones entre un producto y sus proveedores
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
export async function updateProductoProveedores(req, res) {
    try {
        const { proveedoresIds } = req.body;
        const { productoId } = req.query;

        // Validamos toda la data de entrada tanto por el body como por la query.
        const { error } = productoProveedoresValidation.validate({ ...req.body, ...req.query });
        if (error) return handleErrorClient(res, 400, error.message);

        const [relacionesActualizadas, errorService] =
            await ProductoProveedorService.updateProductoProveedores(productoId, proveedoresIds);

        if(errorService === "Producto no encontrado"
            || errorService === "El proveedor ingresado no existe.") {
            return handleErrorClient(res, 404, errorService);

        }
        if (errorService) return handleErrorClient(res, 400, errorService);

        handleSuccess(res, 200, "Relaciones actualizadas correctamente", relacionesActualizadas);
    } catch (error) {
        handleErrorServer(res, 500, "Error relaciones producto-proveedores", error.message);
    }
}


export default {
    createProductoProveedores,
    getProveedoresByProducto,
    deleteProveedorByRelacionId,
    updateProductoProveedores
};
