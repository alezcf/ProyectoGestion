"use strict";
import ProveedorService from "../services/proveedor.service.js";
import {
    proveedorBodyValidation,
    proveedorQueryValidation
} from "../validations/proveedor.validation.js";
import {
    handleErrorClient,
    handleErrorServer,
    handleSuccess
} from "../handlers/responseHandlers.js";

/**
 * Crea un nuevo proveedor
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
export async function createProveedor(req, res) {
    try {
        const { body } = req;

        const { error } = proveedorBodyValidation.validate(body);

        if (error) return handleErrorClient(res, 400, "Error de validación", error.message);

        const [proveedor, errorProveedor] = await ProveedorService.createProveedor(body);

        if (errorProveedor) return handleErrorClient(res, 400, errorProveedor);

        handleSuccess(res, 201, "Proveedor creado correctamente", proveedor);
    } catch (error) {
        handleErrorServer(res, 500, "Error creando un proveedor", error.message);
    }
}

/**
 * Obtiene un proveedor por su ID, RUT o Email
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
export async function getProveedor(req, res) {
    try {
        const { rut, id, email } = req.query;

        const { error } = proveedorQueryValidation.validate({ rut, id, email });

        if (error) return handleErrorClient(res, 400, "Error de validación", error.message);

        const [proveedor, errorProveedor] = await ProveedorService.getProveedor({ rut, id, email });

        if (errorProveedor) return handleErrorClient(res, 404, errorProveedor);

        handleSuccess(res, 200, "Proveedor encontrado", proveedor);
    } catch (error) {
        handleErrorServer(res, 500, "Error obteniendo un proveedor", error.message);
    }
}

/**
 * Obtiene todos los proveedores
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
export async function getProveedores(req, res) {
    try {
        const [proveedores, errorProveedores] = await ProveedorService.getProveedores();

        if (errorProveedores) return handleErrorClient(res, 404, errorProveedores);

        handleSuccess(res, 200, "Proveedores encontrados", proveedores);
    } catch (error) {
        handleErrorServer(res, 500, "Error obteniendo a los proveedores", error.message);
    }
}

/**
 * Actualiza un proveedor por su ID, RUT o Email
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
export async function updateProveedor(req, res) {
    try {
        const { rut, id, email } = req.query;
        const { body } = req;

        const { error: queryError } = proveedorQueryValidation.validate({ rut, id, email });

        if (queryError) {
        return handleErrorClient(res, 400, "Error de validación", queryError.message);
        }

        const { error: bodyError } = proveedorBodyValidation.validate(body);

        if (bodyError) return handleErrorClient(res, 400, "Error de validación", bodyError.message);

        const [proveedor, errorProveedor] = await ProveedorService.updateProveedor(
            { rut, id, email },
            body
        );

        if (errorProveedor) return handleErrorClient(res, 400, errorProveedor);

        handleSuccess(res, 200, "Proveedor modificado correctamente", proveedor);
    } catch (error) {
        handleErrorServer(res, 500, "Error modificando un proveedor", error.message);
    }
}

/**
 * Elimina un proveedor por su ID, RUT o Email
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
export async function deleteProveedor(req, res) {
    try {
        const { rut, id, email } = req.query;

        const { error: queryError } = proveedorQueryValidation.validate({ rut, id, email });

        if (queryError) {
        return handleErrorClient(res, 400, "Error de validación", queryError.message);
        }

        const [proveedorDelete, errorProveedorDelete] = await ProveedorService.deleteProveedor({
            rut,
            id,
            email
        });

        if (errorProveedorDelete) return handleErrorClient(res, 404, errorProveedorDelete);

        handleSuccess(res, 200, "Proveedor eliminado correctamente", proveedorDelete);
    } catch (error) {
        handleErrorServer(res, 500, "Error eliminando un proveedor", error.message);
    }
}

export default {
    createProveedor,
    getProveedor,
    getProveedores,
    updateProveedor,
    deleteProveedor,
};
