"use strict";
import ProductoProveedor from "../entity/producto_proveedor.entity.js";
import Proveedor from "../entity/proveedor.entity.js";
import Producto from "../entity/producto.entity.js";
import { AppDataSource } from "../config/configDb.js";
import { In } from "typeorm";

/**
 * Crea relaciones entre un producto y varios proveedores en la tabla intermedia producto_proveedor
 * @param {number} productoId - ID del producto
 * @param {Array<number>} proveedoresIds - IDs de los proveedores
 * @returns {Promise} Promesa con las relaciones creadas o un error
 */
async function createProductoProveedores(productoId, proveedoresIds) {
    try {
        const productoRepository = AppDataSource.getRepository(Producto);
        const proveedorRepository = AppDataSource.getRepository(Proveedor);
        const productoProveedorRepository = AppDataSource.getRepository(ProductoProveedor);

        console.log("Creando relaciones producto-proveedores...");

        // Verificar si el producto existe
        const producto = await productoRepository.findOne({ where: { id: productoId } });
        if (!producto) return [null, "Producto no encontrado"];

        // Obtener los proveedores
        const proveedores = await proveedorRepository.findBy({ id: In(proveedoresIds) });
        if (proveedores.length !== proveedoresIds.length) {
            return [null, "Uno o más proveedores no existen"];
        }

        const nuevasRelaciones = [];

        // Verificar si ya existe una relación entre el producto y el proveedor
        for (const proveedor of proveedores) {
            const relacionExistente = await productoProveedorRepository.findOne({
                where: { producto: { id: productoId }, proveedor: { id: proveedor.id } }
            });

            if (!relacionExistente) {
                // Si no existe la relación, la agregamos a las nuevas relaciones
                nuevasRelaciones.push(
                    productoProveedorRepository.create({
                        producto,
                        proveedor
                    })
                );
            } else {
                console.log(
                    `La relación entre el producto ${productoId} y el proveedor `
                    + `${proveedor.id} ya existe.`
                );
            }
        }

        // Guardar las nuevas relaciones (solo las que no existían previamente)
        if (nuevasRelaciones.length > 0) {
            const savedRelaciones = await productoProveedorRepository.save(nuevasRelaciones);
            console.log("Relaciones creadas correctamente:", savedRelaciones);
            return [savedRelaciones, null];
        } else {
            console.log("No se crearon nuevas relaciones porque todas ya existían.");
            return [null, "Todas las relaciones ya existían"];
        }
    } catch (error) {
        console.error("Error al crear relaciones producto-proveedores:", error);
        return [null, "Error interno del servidor"];
    }
}

/**
 * Obtiene todos los proveedores asociados a un producto
 * @param {number} productoId - ID del producto
 * @returns {Promise} Promesa con los proveedores o un error
 */
async function getProveedoresByProducto(productoId) {
    try {
        const productoProveedorRepository = AppDataSource.getRepository(ProductoProveedor);

        const relaciones = await productoProveedorRepository.find({
            where: { producto: { id: productoId } },
            relations: ["proveedor", "producto"]
        });

        return [relaciones, null];
    } catch (error) {
        console.error("Error al obtener proveedores del producto:", error);
        return [null, "Error interno del servidor"];
    }
}
/**
 * Elimina una relación específica en la tabla producto_proveedor por su ID (clave primaria)
 * @param {number} relacionId - ID de la relación en la tabla producto_proveedor
 * @returns {Promise} Promesa con la relación eliminada o un error
 */
async function deleteProveedorByRelacionId(relacionId) {
    try {
        const productoProveedorRepository = AppDataSource.getRepository(ProductoProveedor);

        // Eliminar la relación por su ID (clave primaria)
        const resultado = await productoProveedorRepository.delete({ id: relacionId });

        if (resultado.affected === 0) {
            return [null, "Relación no encontrada"];
        }

        return [resultado, null];
    } catch (error) {
        console.error("Error al eliminar la relación producto-proveedor:", error);
        return [null, "Error interno del servidor"];
    }
}

/**
 * Actualiza las relaciones entre un producto y sus proveedores en la tabla intermedia producto_proveedor
 * @param {number} productoId - ID del producto
 * @param {Array<number>} proveedoresIds - Nuevos IDs de los proveedores a asociar
 * @returns {Promise} Promesa con las relaciones actualizadas o un error
 */
async function updateProductoProveedores(productoId, proveedoresIds) {
    try {
        const productoRepository = AppDataSource.getRepository(Producto);
        const proveedorRepository = AppDataSource.getRepository(Proveedor);
        const productoProveedorRepository = AppDataSource.getRepository(ProductoProveedor);

        // Verificar si el producto existe
        const producto = await productoRepository.findOne({ where: { id: productoId } });
        if (!producto) return [null, "Producto no encontrado"];

        // Verificar si los proveedores existen
        const proveedores = await proveedorRepository.findBy({ id: In(proveedoresIds) });
        if (proveedores.length !== proveedoresIds.length) {
            return [null, "El proveedor ingresado no existe."];
        }

        // Eliminar las relaciones actuales entre el producto y los proveedores
        await productoProveedorRepository.delete({ producto: { id: productoId } });

        // Crear nuevas relaciones con los proveedores actualizados
        const productoProveedores = proveedores.map(proveedor => {
            return productoProveedorRepository.create({
                producto,
                proveedor
            });
        });

        // Guardar las nuevas relaciones
        const updatedRelaciones = await productoProveedorRepository.save(productoProveedores);
        return [updatedRelaciones, null];
    } catch (error) {
        console.error("Error al actualizar relaciones producto-proveedores:", error);
        return [null, "Error interno del servidor"];
    }
}


/**
 * Obtiene todos los productos asociados a un proveedor específico
 * @param {number} proveedorId - ID del proveedor
 * @returns {Promise} Promesa con los productos asociados o un error
 */
async function getProductosByProveedor(proveedorId) {
    try {
        const productoProveedorRepository = AppDataSource.getRepository(ProductoProveedor);

        // Obtener relaciones con productos asociados al proveedor
        const relaciones = await productoProveedorRepository.find({
            where: { proveedor: { id: proveedorId } },
            relations: ["producto", "proveedor"]
        });

        if (!relaciones || relaciones.length === 0) {
            return [null, "No se encontraron productos asociados a este proveedor"];
        }

        // Extraer solo los productos de las relaciones
        const productos = relaciones.map(relacion => relacion.producto);

        return [productos, null];
    } catch (error) {
        console.error("Error al obtener productos por proveedor:", error);
        return [null, "Error interno del servidor"];
    }
}

export default {
    createProductoProveedores,
    getProveedoresByProducto,
    deleteProveedorByRelacionId,
    updateProductoProveedores,
    getProductosByProveedor
};
