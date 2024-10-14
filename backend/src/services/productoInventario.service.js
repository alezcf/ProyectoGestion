"use strict";
import ProductoInventario from "../entity/producto_inventario.entity.js";
import Inventario from "../entity/inventario.entity.js";
import Producto from "../entity/producto.entity.js";
import { AppDataSource } from "../config/configDb.js";
import { In } from "typeorm";

/**
 * Crea relaciones entre un producto y varios inventarios en la tabla intermedia producto_inventario.
 * @param {number} productoId - ID del producto
 * @param {Array<number>} inventariosIds - IDs de los inventarios
 * @param {Array<number>} cantidades - Cantidades correspondientes a cada inventario
 * @returns {Promise} Promesa con las relaciones creadas o un error
 */
async function createProductoInventarios(productoId, inventariosIds, cantidades) {
    try {
        const productoRepository = AppDataSource.getRepository(Producto);
        const inventarioRepository = AppDataSource.getRepository(Inventario);
        const productoInventarioRepository = AppDataSource.getRepository(ProductoInventario);
        // Verificar si el producto existe
        const producto = await productoRepository.findOne({ where: { id: productoId } });
        if (!producto) return [null, "Producto no encontrado"];

        const inventarios = [];
        const errores = [];

        // Verificar si cada inventario existe
        for (const inventarioId of inventariosIds) {
            const inventario = await inventarioRepository.findOne({ where: { id: inventarioId } });
            if (!inventario) {
                errores.push("Inventario no encontrado");
            } else {
                inventarios.push(inventario); // Guardamos los inventarios válidos
            }
        }

        // Si hay errores de inventarios no encontrados, los devolvemos
        if (errores.length > 0) {
            return [null, errores.join(", ")];
        }

        const nuevasRelaciones = [];

        // Iteramos sobre los inventarios y las cantidades
        for (let i = 0; i < inventarios.length; i++) {
            const inventario = inventarios[i];
            const cantidad = cantidades[i];

            // Verificar si la relación ya existe
            const relacionExistente = await productoInventarioRepository.findOne({
                where: { producto: { id: productoId }, inventario: { id: inventario.id } }
            });

            if (!relacionExistente) {
                // Si no existe la relación, la creamos
                nuevasRelaciones.push(
                    productoInventarioRepository.create({
                        producto,
                        inventario,
                        cantidad // Añadimos la cantidad correspondiente
                    })
                );
            } else {
                return [null, "La relación entre el producto y el inventario ya existe."];
            }
        }

        // Guardar las nuevas relaciones si hay alguna
        if (nuevasRelaciones.length > 0) {
            const savedRelaciones = await productoInventarioRepository.save(nuevasRelaciones);
            console.log("Relaciones creadas correctamente:", savedRelaciones);
            return [savedRelaciones, null];
        } else {
            console.log("No se crearon nuevas relaciones porque todas ya existían.");
            return [null, "Todas las relaciones ya existían"];
        }
    } catch (error) {
        console.error("Error al crear relaciones producto-inventarios:", error);
        return [null, "Error interno del servidor"];
    }
}



/**
 * Obtiene todos los inventarios asociados a un producto
 * @param {number} productoId - ID del producto
 * @returns {Promise} Promesa con los inventarios o un error
 */
async function getInventariosByProducto(productoId) {
    try {
        const productoInventarioRepository = AppDataSource.getRepository(ProductoInventario);

        const relaciones = await productoInventarioRepository.find({
            where: { producto: { id: productoId } },
            relations: ["inventario", "producto"]
        });

        return [relaciones, null];
    } catch (error) {
        console.error("Error al obtener inventarios del producto:", error);
        return [null, "Error interno del servidor"];
    }
}

/**
 * Elimina una relación específica en la tabla producto_inventario por su ID (clave primaria)
 * @param {number} relacionId - ID de la relación en la tabla producto_inventario
 * @returns {Promise} Promesa con la relación eliminada o un error
 */
async function deleteInventarioByRelacionId(relacionId) {
    try {
        const productoInventarioRepository = AppDataSource.getRepository(ProductoInventario);

        const resultado = await productoInventarioRepository.delete({ id: relacionId });

        if (resultado.affected === 0) {
            return [null, "Relación no encontrada"];
        }

        return [resultado, null];
    } catch (error) {
        console.error("Error al eliminar la relación producto-inventario:", error);
        return [null, "Error interno del servidor"];
    }
}

/**
 * Actualiza las relaciones entre un producto y sus inventarios en la tabla intermedia producto_inventario.
 * Si una relación no existe, se crea automáticamente. Si ya existe, se devuelve un error para esa relación.
 * @param {number} productoId - ID del producto
 * @param {Array<number>} inventariosIds - Nuevos IDs de los inventarios a asociar
 * @param {Array<number>} cantidades - Cantidades correspondientes a cada inventario
 * @returns {Promise} Promesa con las relaciones actualizadas o un error
 */
async function updateProductoInventarios(productoId, inventariosIds, cantidades) {
    try {
        const productoRepository = AppDataSource.getRepository(Producto);
        const inventarioRepository = AppDataSource.getRepository(Inventario);
        const productoInventarioRepository = AppDataSource.getRepository(ProductoInventario);

        // Verificar si el producto existe
        const producto = await productoRepository.findOne({ where: { id: productoId } });
        if (!producto) return [null, `Producto con ID ${productoId} no encontrado`];

        const inventarios = [];
        const errores = [];

        // Verificar si cada inventario existe
        for (const inventarioId of inventariosIds) {
            const inventario = await inventarioRepository.findOne({ where: { id: inventarioId } });
            if (!inventario) {
                errores.push(`Inventario con ID ${inventarioId} no encontrado`);
            } else {
                inventarios.push(inventario); // Guardamos solo los inventarios que existen
            }
        }

        // Si hay errores, devolvemos de inmediato
        if (errores.length > 0) {
            return [null, errores.join(", ")];
        }

        const nuevasRelaciones = [];
        const relacionesActualizadas = [];

        // Iteramos sobre los inventarios y las cantidades
        for (let i = 0; i < inventarios.length; i++) {
            const inventario = inventarios[i];
            const cantidad = cantidades[i];

            // Verificar si la relación ya existe
            let relacion = await productoInventarioRepository.findOne({
                where: { producto: { id: productoId }, inventario: { id: inventario.id } }
            });

            if (!relacion) {
                // Si la relación no existe, la creamos
                relacion = productoInventarioRepository.create({
                    producto,
                    inventario,
                    cantidad
                });
                nuevasRelaciones.push(relacion);
            } else {
                // Si la relación ya existe, actualizar la cantidad
                relacionesActualizadas.push(relacion);
                return [null, "El producto ya se encuentra registrado en el inventario."];
            }
        }

        // Guardar las nuevas relaciones si hay alguna
        if (nuevasRelaciones.length > 0) {
            const savedRelaciones = await productoInventarioRepository.save(nuevasRelaciones);
            relacionesActualizadas.push(...savedRelaciones);
        }

        // Si hay errores pero también relaciones actualizadas, devolver ambas cosas
        if (errores.length > 0) {
            return [relacionesActualizadas, errores];
        }

        // Guardar las relaciones actualizadas si no hay errores
        if (relacionesActualizadas.length > 0) {
            const updatedRelaciones = await productoInventarioRepository.save(relacionesActualizadas);
            return [updatedRelaciones, null];
        }

        return [null, "No se realizaron cambios"];
    } catch (error) {
        console.error("Error al actualizar relaciones producto-inventarios:", error);
        return [null, "Error interno del servidor"];
    }
}



export default {
    createProductoInventarios,
    getInventariosByProducto,
    deleteInventarioByRelacionId,
    updateProductoInventarios
};
