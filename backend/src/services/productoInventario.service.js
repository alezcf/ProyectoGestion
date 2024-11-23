"use strict";
import ProductoInventario from "../entity/producto_inventario.entity.js";
import Inventario from "../entity/inventario.entity.js";
import Producto from "../entity/producto.entity.js";
import { AppDataSource } from "../config/configDb.js";

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

            // Obtener todas las relaciones producto-inventario para este inventario
            const relacionesExistentes = await productoInventarioRepository.find({
                where: { inventario: { id: inventario.id } },
                relations: ["producto"] // Incluimos las relaciones necesarias
            });

            // Sumar las cantidades existentes en el inventario
            const sumaActual = relacionesExistentes.reduce(
                (total, relacion) => total + relacion.cantidad,
                0
            );
            const nuevaSuma = sumaActual + cantidad;

            const inventarioId = inventario.id;
            const maximoStock = inventario.maximo_stock;
            console.log(`Inventario ${inventarioId}: Stock actual total = ${sumaActual}, `
                        + `Stock máximo = ${maximoStock}, Nuevo stock propuesto = ${nuevaSuma}`);

            // Verificar si supera el stock máximo
            if (nuevaSuma > inventario.maximo_stock) {
                const maximoStock = inventario.maximo_stock;
                const inventarioNombre = inventario.nombre;
                return [null, `El stock total (${nuevaSuma}) supera el stock máximo (${maximoStock}) `
                                + `del inventario ${inventarioNombre}`];
            }

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
        if (!producto) return [null, "Producto no encontrado"];
        console.log("Producto encontrado:", producto);
        const inventarios = [];
        const errores = [];

        // Verificar si cada inventario existe
        for (const inventarioId of inventariosIds) {
            const inventario = await inventarioRepository.findOne({ where: { id: inventarioId } });
            if (!inventario) {
                errores.push("Inventario no encontrado");
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

/**
 * Obtiene todos los productos asociados a un inventario
 * @param {number} inventarioId - ID del inventario
 * @returns {Promise} Promesa con los productos o un error
 */
async function getProductosByInventario(inventarioId) {
    try {
        const productoInventarioRepository = AppDataSource.getRepository(ProductoInventario);

        // Buscamos todas las relaciones en la tabla producto_inventario donde el inventario coincide
        const relaciones = await productoInventarioRepository.find({
            where: { inventario: { id: inventarioId } },
            relations: ["producto", "inventario"]
        });

        if (relaciones.length === 0) {
            return [null, "No se encontraron productos asociados a este inventario"];
        }

        // Extraemos solo los productos relacionados
        const productos = relaciones.map(relacion => relacion.producto);

        return [productos, null];
    } catch (error) {
        console.error("Error al obtener productos del inventario:", error);
        return [null, "Error interno del servidor"];
    }
}

/**
 * Obtiene el stock global actual de cada producto sumando las cantidades en todos los inventarios
 * @returns {Promise} Promesa con el stock global por producto o un error
 */
async function getStockGlobalProductos() {
    try {
        const productoInventarioRepository = AppDataSource.getRepository(ProductoInventario);

        // Ajuste en el alias de campo de `producto_id`
        const stockGlobalProductos = await productoInventarioRepository
            .createQueryBuilder("pi")
            .select("pi.producto_id", "productoId")
            .addSelect("SUM(pi.cantidad)", "stockGlobal")
            .innerJoin("pi.producto", "producto")
            .groupBy("pi.producto_id")
            .getRawMany();

        return [stockGlobalProductos, null];
    } catch (error) {
        console.error("Error al calcular el stock global de productos:", error);
        return [null, "Error interno del servidor"];
    }
}

/**
 * Actualiza la cantidad de un producto en un inventario específico.
 * Si la nueva cantidad es 0, elimina la relación y notifica.
 * Si la nueva cantidad es menor a 0, no permite la acción y envía un error.
 * Si la nueva cantidad es mayor a 0, valida que la suma de todas las cantidades no exceda el stock máximo del inventario.
 *
 * @param {number} relacionId - ID del registro en producto_inventario
 * @param {number} nuevaCantidad - Nueva cantidad a actualizar
 * @returns {Promise} Promesa con el resultado de la operación o un error
 */
async function updateCantidadProductoInventario(relacionId, nuevaCantidad) {
    try {
        const productoInventarioRepository = AppDataSource.getRepository(ProductoInventario);
        console.log("Relación ID:", relacionId, "Nueva cantidad:", nuevaCantidad);

        // Obtener la relación producto-inventario
        const relacion = await productoInventarioRepository.findOne({
            where: { id: relacionId },
            relations: ["inventario"]
        });

        if (!relacion) {
            return [null, "Relación no encontrada"];
        }

        const { inventario } = relacion;

        // Validación: Si la nueva cantidad es menor a 0, no permitir la acción
        if (nuevaCantidad <= 0) {
            return [null, "La nueva cantidad debe ser mayor a 0."];
        }

        // Obtener todas las relaciones del inventario
        const relacionesExistentes = await productoInventarioRepository.find({
            where: { inventario: { id: inventario.id } }
        });

        // Sumar todas las cantidades, excluyendo la cantidad actual de esta relación
        const sumaActualSinRelacion = relacionesExistentes.reduce(
            (total, r) => total + (r.id === relacion.id ? 0 : r.cantidad),
            0
        );

        // Calcular la suma total propuesta
        const sumaPropuesta = sumaActualSinRelacion + nuevaCantidad;

        // Validación: Verificar que la suma total no exceda el stock máximo
        if (sumaPropuesta > inventario.maximo_stock) {
            return [null, `La actualización de cantidad supera el stock máximo (${inventario.maximo_stock}) del inventario`];
        }

        // Actualizar la cantidad
        relacion.cantidad = nuevaCantidad;
        const relacionActualizada = await productoInventarioRepository.save(relacion);

        return [relacionActualizada, null];
    } catch (error) {
        console.error("Error al actualizar la cantidad del producto-inventario:", error);
        return [null, "Error interno del servidor"];
    }
}

export default {
    createProductoInventarios,
    getInventariosByProducto,
    deleteInventarioByRelacionId,
    updateProductoInventarios,
    getProductosByInventario,
    getStockGlobalProductos,
    updateCantidadProductoInventario,
};
