"use strict";
import VendedorService from "../services/vendedor.service.js";
import { 
    vendedorBodyValidation, 
    vendedorQueryValidation 
} from "../validations/vendedor.validation.js";
import { 
    handleErrorClient, 
    handleErrorServer, 
    handleSuccess 
} from "../handlers/responseHandlers.js";

/**
 * Crea un nuevo vendedor
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
export async function createVendedor(req, res) {
    try {
        const { body } = req;

        const { error } = vendedorBodyValidation.validate(body);

        if (error) return handleErrorClient(res, 400, "Error de validación", error.message);

        const [vendedor, errorVendedor] = await VendedorService.createVendedor(body);

        if (errorVendedor) return handleErrorClient(res, 400, errorVendedor);

        handleSuccess(res, 201, "Vendedor creado correctamente", vendedor);
    } catch (error) {
        handleErrorServer(res, 500, "Error creando un vendedor", error.message);
    }
}

/**
 * Obtiene un vendedor por su ID o Email
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
export async function getVendedor(req, res) {
    try {
        const { id, email } = req.query;

        const { error } = vendedorQueryValidation.validate({ id, email });

        if (error) return handleErrorClient(res, 400, "Error de validación", error.message);

        const [vendedor, errorVendedor] = await VendedorService.getVendedor({ id, email });

        if (errorVendedor) return handleErrorClient(res, 404, errorVendedor);

        handleSuccess(res, 200, "Vendedor encontrado", vendedor);
    } catch (error) {
        handleErrorServer(res, 500, "Error obteniendo un vendedor", error.message);
    }
}

/**
 * Obtiene todos los vendedores
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
export async function getVendedores(req, res) {
    try {
        const [vendedores, errorVendedores] = await VendedorService.getVendedores();

        if (errorVendedores) return handleErrorClient(res, 404, errorVendedores);

        handleSuccess(res, 200, "Vendedores encontrados", vendedores);
    } catch (error) {
        handleErrorServer(res, 500, "Error obteniendo a los vendedores", error.message);
    }
}

/**
 * Actualiza un vendedor por su ID o Email
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
export async function updateVendedor(req, res) {
    try {
        const { id, email } = req.query;
        const { body } = req;

        const { error: queryError } = vendedorQueryValidation.validate({ id, email });

        if (queryError) {
        return handleErrorClient(res, 400, "Error de validación", queryError.message);
        }

        const { error: bodyError } = vendedorBodyValidation.validate(body);

        if (bodyError) return handleErrorClient(res, 400, "Error de validación", bodyError.message);

        const [vendedor, errorVendedor] = await VendedorService.updateVendedor({ id, email }, body);

        if (errorVendedor) return handleErrorClient(res, 400, errorVendedor);

        handleSuccess(res, 200, "Vendedor modificado correctamente", vendedor);
    } catch (error) {
        handleErrorServer(res, 500, "Error modificando un vendedor", error.message);
    }
}

/**
 * Elimina un vendedor por su ID o Email
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
export async function deleteVendedor(req, res) {
    try {
        const { id, email } = req.query;

        const { error: queryError } = vendedorQueryValidation.validate({ id, email });

        if (queryError) {
        return handleErrorClient(res, 400, "Error de validación", queryError.message);
        }

        const [vendedorDelete, errorVendedorDelete] = await VendedorService.deleteVendedor({ 
            id, 
            email 
        });

        if (errorVendedorDelete) return handleErrorClient(res, 404, errorVendedorDelete);

        handleSuccess(res, 200, "Vendedor eliminado correctamente", vendedorDelete);
    } catch (error) {
        handleErrorServer(res, 500, "Error eliminando un vendedor", error.message);
    }
}

export default {
    createVendedor,
    getVendedor,
    getVendedores,
    updateVendedor,
    deleteVendedor,
};
