"use strict";
import ProductoService from "../services/producto.service.js";
import {
    productoBodyValidation,
    productoQueryValidation
} from "../validations/producto.validation.js";
import {
    handleErrorClient,
    handleErrorServer,
    handleSuccess
} from "../handlers/responseHandlers.js";

/**
 * Crea un nuevo producto
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
export async function createProducto(req, res) {
    try {
        const { body } = req;
        console.log(body);
        const { error } = productoBodyValidation.validate(body);
        if (error) return handleErrorClient(res, 400, "Error de validación", error.message);

        const imagenRuta = req.file ? req.file.path : null;

        const productoData = {
            ...body,
            imagen_ruta: imagenRuta,
        };

        // Crear el producto en la base de datos
        const [producto, errorProducto] = await ProductoService.createProducto(productoData);

        if (errorProducto) return handleErrorClient(res, 400, errorProducto);

        handleSuccess(res, 201, "Producto creado correctamente", producto);
    } catch (error) {
        handleErrorServer(res, 500, "Error creando un producto", error.message);
    }
}

/**
 * Obtiene un producto por su ID
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
export async function getProducto(req, res) {
    try {
        const { id } = req.query;

        const { error } = productoQueryValidation.validate({ id });

        if (error) return handleErrorClient(res, 400, "Error de validación", error.message);

        const [producto, errorProducto] = await ProductoService.getProducto({ id });

        if (errorProducto) return handleErrorClient(res, 404, errorProducto);

        handleSuccess(res, 200, "Producto encontrado", producto);
    } catch (error) {
        handleErrorServer(res, 500, "Error obteniendo un producto", error.message);
    }
}

/**
 * Obtiene todos los productos
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
export async function getProductos(req, res) {
    try {
        const [productos, errorProductos] = await ProductoService.getProductos();

        if (errorProductos) return handleErrorClient(res, 404, errorProductos);

        handleSuccess(res, 200, "Productos encontrados", productos);
    } catch (error) {
        handleErrorServer(res, 500, "Error obteniendo los productos", error.message);
    }
}

/**
 * Actualiza un producto por su ID
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
export async function updateProducto(req, res) {
    try {
        const { id } = req.query;
        const { body } = req;

        const nuevaImagenRuta = req.file ? req.file.path : null;

        if (nuevaImagenRuta) {
            body.imagen_ruta = nuevaImagenRuta;
        }
        else{
            delete body.imagen;
        }

        const { error } = productoQueryValidation.validate({ id });
        if (error) {
            return handleErrorClient(res, 400, "Error de validación", error.message);
        }

        // Llamar al servicio para actualizar el producto
        const [producto, errorProducto] = await ProductoService.updateProducto({ id }, body);
        if (errorProducto) {
            return handleErrorClient(res, 400, errorProducto);
        }

        handleSuccess(res, 200, "Producto modificado correctamente", producto);
    } catch (error) {
        handleErrorServer(res, 500, "Error modificando un producto", error.message);
    }
}

/**
 * Elimina un producto por su ID
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
export async function deleteProducto(req, res) {
    try {
        const { id } = req.query;

        const { error: queryError } = productoQueryValidation.validate({ id });

        if (queryError) {
            return handleErrorClient(res, 400, "Error de validación", queryError.message);
        }

        const [productoDelete, errorProductoDelete] = await ProductoService.deleteProducto({ id });

        if (errorProductoDelete) return handleErrorClient(res, 404, errorProductoDelete);

        handleSuccess(res, 200, "Producto eliminado correctamente", productoDelete);
    } catch (error) {
        handleErrorServer(res, 500, "Error eliminando un producto", error.message);
    }
}

export default {
    createProducto,
    getProducto,
    getProductos,
    updateProducto,
    deleteProducto,
};
