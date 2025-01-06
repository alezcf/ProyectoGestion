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

        let newInventario = inventarioRepository.create({
            nombre: body.nombre,
            maximo_stock: body.maximo_stock,
            ultima_actualizacion: new Date()
        });

        newInventario = await inventarioRepository.save(newInventario);

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
            relations: ["productoInventarios", "productoInventarios.producto"],
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
            relations: ["productoInventarios", "productoInventarios.producto"],
        });

        if (!inventarios || inventarios.length === 0) return [null, "No hay inventarios registrados."];

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
        const productoInventarioRepository = AppDataSource.getRepository(ProductoInventario);

        // Verificar si el inventario existe
        const inventarioFound = await inventarioRepository.findOne({ where: { id: query.id } });
        console.log(inventarioFound);
        if (!inventarioFound) return [null, "Inventario no encontrado"];

        if (body.productos?.length) {
            // Verificar existencia de todos los productos
            const productoIds = body.productos.map(p => p.id);
            const productosExistentes = await productoRepository.find({
                where: { id: In(productoIds) }
            });

            if (productosExistentes.length !== productoIds.length) {
                return [null, "Los productos solicitados por ingresar no existen."];
            }

            // Calcular el stock basado solo en los productos que se están actualizando
            const nuevoStockPropuesto = body.productos.reduce(
                (total, prod) => total + prod.cantidad,
                0
            );

            // Verificar si supera el maximo_stock
            if (nuevoStockPropuesto > body.maximo_stock) {
                return [null, "El stock actual supera el máximo permitido."];
            }

            // Limpiar y crear nuevas relaciones
            await productoInventarioRepository.delete({ inventario: { id: inventarioFound.id } });
            const nuevosProductoInventarios = body.productos.map((producto) => {
                const id = producto.id;
                return productoInventarioRepository.create({
                    inventario: { id: inventarioFound.id },
                    producto: { id },
                    cantidad: producto.cantidad
                });
            });
            await productoInventarioRepository.save(nuevosProductoInventarios);
        }

        // Actualizar los campos básicos del inventario
        await inventarioRepository.update({ id: query.id }, {
            nombre: body.nombre,
            maximo_stock: body.maximo_stock,
            ultima_actualizacion: new Date()
        });

        // Recuperar y retornar el inventario actualizado
        const updatedInventario = await inventarioRepository.findOne({
            where: { id: query.id },
            relations: ["productoInventarios", "productoInventarios.producto"],
        });

        return updatedInventario
            ? [updatedInventario, null]
            : [null, "Error al recuperar el inventario actualizado"];
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

        // Buscar el inventario junto con sus productos asociados
        const inventarioFound = await inventarioRepository.findOne({
            where: { id: query.id },
            relations: ["productoInventarios"], // Incluye relaciones con productos
        });

        if (!inventarioFound) return [null, "Inventario no encontrado"];

        // Validar si hay productos asociados
        if (inventarioFound.productoInventarios.length > 0) {
            return [null, "Debes eliminar todos los productos del inventario antes de eliminarlo."];
        }

        // Eliminar el inventario si no tiene productos asociados
        await inventarioRepository.remove(inventarioFound);

        return [inventarioFound, null];
    } catch (error) {
        console.error("Error al eliminar un inventario:", error);
        return [null, "Error interno del servidor"];
    }
}


/**
 * Obtiene el nivel de stock actual y máximo para cada inventario
 * @returns {Promise} Promesa con el informe de inventarios y sus niveles de stock
 */
async function getInventarioStock() {
    try {
        const inventarioRepository = AppDataSource.getRepository(Inventario);

        // Agrupamos el stock actual por inventario y comparamos con el máximo stock
        const inventarioStock = await inventarioRepository
            .createQueryBuilder("inventario")
            .select("inventario.nombre", "nombre")
            .addSelect("inventario.maximo_stock", "maximoStock")
            .addSelect("COALESCE(SUM(productoInventario.cantidad), 0)", "stockActual")
            .leftJoin(
                ProductoInventario,
                "productoInventario",
                "productoInventario.inventario = inventario.id"
            )
            .groupBy("inventario.id")
            .getRawMany();

        return [inventarioStock, null];
    } catch (error) {
        console.error("Error al obtener inventarios y stock:", error);
        return [null, "Error interno del servidor"];
    }
}

/**
 * Obtiene la cantidad de productos agrupados por categoría
 * @returns {Promise} Promesa con el número de productos por categoría o un error
 */
async function getCantidadProductosPorCategoria() {
    try {
        const productoInventarioRepository = AppDataSource.getRepository(ProductoInventario);

        // Realizamos la consulta para obtener la suma de cantidad por cada categoría de producto
        const cantidadProductosPorCategoria = await productoInventarioRepository
            .createQueryBuilder("productoInventario")
            .select("producto.categoria", "categoria")
            .addSelect("SUM(productoInventario.cantidad)", "totalCantidad") // Suma las cantidades
            .innerJoin("productoInventario.producto", "producto")
            .groupBy("producto.categoria")
            .getRawMany();

        return [cantidadProductosPorCategoria, null];
    } catch (error) {
        console.error("Error al obtener la cantidad de productos por categoría:", error);
        return [null, "Error interno del servidor"];
    }
}


export default {
    createInventario,
    getInventario,
    getInventarios,
    getInventarioStock,
    getCantidadProductosPorCategoria,
    updateInventario,
    deleteInventario,
};