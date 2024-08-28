"use strict";
import Inventario from "../entity/inventario.entity.js";
import Producto from "../entity/producto.entity.js";
import ProductoInventario from "../entity/producto_inventario.entity.js";
import { AppDataSource } from "../config/configDb.js";
import { In } from "typeorm";

/**
 * Crea un nuevo inventario en la base de datos
 * @param {Object} body - Datos del inventario
 * @returns {Promise} Promesa con el objeto de inventario creado o un error
 */
async function createInventario(body) {
    try {
        const inventarioRepository = AppDataSource.getRepository(Inventario);
        const productoRepository = AppDataSource.getRepository(Producto);
        const productoInventarioRepository = AppDataSource.getRepository(ProductoInventario);

        // Crear un nuevo inventario
        let newInventario = inventarioRepository.create(body);
        newInventario = await inventarioRepository.save(newInventario);

        // Asociar productos y cantidades si se proporcionan
        if (body.productos && body.productos.length > 0) {
            for (let i = 0; i < body.productos.length; i++) {
                const productoId = body.productos[i];
                
                const producto = await productoRepository.findOne({
                    where: { id: productoId }
                });

                if (!producto) {
                    return [null, `Producto con id ${productoId} no existe`];
                }

                const productoInventario = productoInventarioRepository.create({
                    producto: producto,
                    inventario: newInventario,
                    cantidad: productoId.cantidad
                });

                await productoInventarioRepository.save(productoInventario);
            }
        }

        return [newInventario, null];
    } catch (error) {
        console.error("Error al crear inventario:", error);
        return [null, "Error interno del servidor"];
    }
}

/**
 * Obtiene un inventario por su ID de la base de datos, incluyendo productos asociados
 * @param {Object} query - Parámetros de consulta (id)
 * @returns {Promise} Promesa con el objeto de inventario encontrado o un error
 */
async function getInventario(query) {
    try {
        const inventarioRepository = AppDataSource.getRepository(Inventario);

        const inventarioFound = await inventarioRepository.findOne({
            where: { id: query.id },
            relations: ["productos"], // Incluir productos asociados
        });

        if (!inventarioFound) return [null, "Inventario no encontrado"];

        return [inventarioFound, null];
    } catch (error) {
        console.error("Error al obtener el inventario:", error);
        return [null, "Error interno del servidor"];
    }
}

/**
 * Obtiene todos los inventarios de la base de datos, incluyendo productos asociados
 * @returns {Promise} Promesa con el objeto de los inventarios encontrados o un error
 */
async function getInventarios() {
    try {
        const inventarioRepository = AppDataSource.getRepository(Inventario);

        const inventarios = await inventarioRepository.find({
            relations: ["productos"], // Incluir productos asociados
        });

        if (!inventarios || inventarios.length === 0) return [null, "No hay inventarios"];

        return [inventarios, null];
    } catch (error) {
        console.error("Error al obtener los inventarios:", error);
        return [null, "Error interno del servidor"];
    }
}

/**
 * Actualiza un inventario por su ID en la base de datos, incluyendo productos asociados
 * @param {Object} query - Parámetros de consulta (id)
 * @param {Object} body - Datos del inventario a actualizar
 * @returns {Promise} Promesa con el objeto de inventario actualizado o un error
 */
async function updateInventario(query, body) {
    try {
        const inventarioRepository = AppDataSource.getRepository(Inventario);
        const productoRepository = AppDataSource.getRepository(Producto);

        const inventarioFound = await inventarioRepository.findOne({
            where: { id: query.id },
            relations: ["productos"], // Incluir productos asociados
        });

        if (!inventarioFound) {
            return [null, "Inventario no encontrado"];
        }

        await inventarioRepository.update({ id: query.id }, body);

        // Actualizar la relación de productos si se proporciona
        if (body.productos && body.productos.length > 0) {
            const productos = await productoRepository.findBy({ id: In(body.productos) });
            if (productos.length !== body.productos.length) {
                return [null, "Uno o más productos no existen"];
            }

            inventarioFound.productos = productos;
            await inventarioRepository.save(inventarioFound);
        }

        const updatedInventario = await inventarioRepository.findOne({
            where: { id: query.id },
            relations: ["productos"], // Asegurarse de que los productos actualizados se carguen
        });

        if (!updatedInventario) {
            return [null, "Error al recuperar el inventario actualizado"];
        }

        return [updatedInventario, null];
    } catch (error) {
        console.error("Error al actualizar un inventario:", error);
        return [null, "Error interno del servidor"];
    }
}

/**
 * Elimina un inventario por su ID de la base de datos, incluyendo productos asociados
 * @param {Object} query - Parámetros de consulta (id)
 * @returns {Promise} Promesa con el objeto de inventario eliminado o un error
 */
async function deleteInventario(query) {
    try {
        const inventarioRepository = AppDataSource.getRepository(Inventario);

        const inventarioFound = await inventarioRepository.findOne({
            where: { id: query.id },
            relations: ["productos"], // Incluir productos asociados
        });

        if (!inventarioFound) return [null, "Inventario no encontrado"];

        await inventarioRepository.remove(inventarioFound);

        return [inventarioFound, null];
    } catch (error) {
        console.error("Error al eliminar un inventario:", error);
        return [null, "Error interno del servidor"];
    }
}

export default {
    createInventario,
    getInventario,
    getInventarios,
    updateInventario,
    deleteInventario,
};
