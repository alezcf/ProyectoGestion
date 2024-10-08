"use strict";
import { In } from "typeorm";
import Pedido from "../entity/pedido.entity.js";
import PedidoProducto from "../entity/pedido_producto.entity.js";
import Proveedor from "../entity/proveedor.entity.js";
import Inventario from "../entity/inventario.entity.js";
import Producto from "../entity/producto.entity.js";
import ProductoInventario from "../entity/producto_inventario.entity.js";
import { AppDataSource } from "../config/configDb.js";

/**
 * Crea un nuevo pedido en la base de datos
 * @param {Object} body - Datos del pedido
 * @returns {Promise} Promesa con el objeto de pedido creado o un error
 */
async function createPedido(body) {
    const queryRunner = AppDataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
        const pedidoRepository = queryRunner.manager.getRepository(Pedido);
        const proveedorRepository = queryRunner.manager.getRepository(Proveedor);
        const inventarioRepository = queryRunner.manager.getRepository(Inventario);
        const productoRepository = queryRunner.manager.getRepository(Producto);
        const pedidoProductoRepository = queryRunner.manager.getRepository(PedidoProducto);
        const productoInventarioRepository = queryRunner.manager.getRepository(ProductoInventario);

        // Verificar si el proveedor existe
        const proveedor = await proveedorRepository.findOne({
            where: { id: body.proveedor_id },
        });
        if (!proveedor) {
            await queryRunner.rollbackTransaction();
            return [null, `Proveedor con id ${body.proveedor_id} no existe`];
        }

        // Verificar si el inventario asignado existe
        const inventario = await inventarioRepository.findOne({
            where: { id: body.inventario_asignado_id },
        });
        if (!inventario) {
            await queryRunner.rollbackTransaction();
            return [null, `Inventario con id ${body.inventario_asignado_id} no existe`];
        }

        // Verificar si los productos existen
        const productoIds = body.productos.map(p => p.productoId);
        const productosExistentes = await productoRepository.findBy({ id: In(productoIds) });

        if (productosExistentes.length !== productoIds.length) {
            const productosNoExistentes = productoIds.filter(id => {
                return !productosExistentes.some(p => p.id === id);
            });
            await queryRunner.rollbackTransaction();
            return [null, `Los productos no existen: ${productosNoExistentes.join(", ")}`];
        }

        // Crear el pedido principal asegurándote de pasar los IDs correctamente
        const newPedido = pedidoRepository.create({
            proveedor: proveedor,
            inventarioAsignado: inventario,
            fecha_pedido: body.fecha_pedido,
            estado: body.estado,
        });

        const savedPedido = await pedidoRepository.save(newPedido);

        // Asociar productos al pedido y actualizar ProductoInventario y stock_actual
        for (const { productoId, cantidad } of body.productos) {
            const producto = await productoRepository.findOne({ where: { id: productoId } });

            // Actualizar o crear ProductoInventario
            let productoInventario = await productoInventarioRepository.findOne({
                where: { inventario: { id: inventario.id }, producto: { id: productoId } },
            });

            if (productoInventario) {
                // Actualizar cantidad en ProductoInventario
                productoInventario.cantidad += cantidad;
            } else {
                // Crear nueva entrada en ProductoInventario
                productoInventario = productoInventarioRepository.create({
                    inventario: inventario,
                    producto: producto,
                    cantidad: cantidad,
                });
            }

            await productoInventarioRepository.save(productoInventario);

            // Actualizar stock_actual en Inventario
            inventario.stock_actual += cantidad;
            await inventarioRepository.save(inventario);

            // Asociar el producto al pedido
            const pedidoProducto = pedidoProductoRepository.create({
                pedido: savedPedido,
                producto: producto,
                cantidad: cantidad,
            });

            await pedidoProductoRepository.save(pedidoProducto);
        }

        // Confirmar la transacción
        await queryRunner.commitTransaction();

        return [savedPedido, null];
    } catch (error) {
        console.error("Error al crear un pedido:", error);
        await queryRunner.rollbackTransaction();
        return [null, "Error interno del servidor"];
    } finally {
        await queryRunner.release();
    }
}




/**
 * Obtiene un pedido por su ID de la base de datos
 * @param {Object} query - Parámetros de consulta (id)
 * @returns {Promise} Promesa con el objeto de pedido
 */
async function getPedido(query) {
    try {
        const pedidoRepository = AppDataSource.getRepository(Pedido);
        const pedidoFound = await pedidoRepository.findOne({
            where: { id: query.id },
            relations: ["pedidoProductos", "pedidoProductos.producto"],
        });

        if (!pedidoFound) return [null, "Pedido no encontrado"];

        return [pedidoFound, null];
    } catch (error) {
        console.error("Error al obtener el pedido:", error);
        return [null, "Error interno del servidor"];
    }
}

/**
 * Obtiene todos los pedidos de la base de datos
 * @returns {Promise} Promesa con el objeto de los pedidos
 */
async function getPedidos() {
    try {
        const pedidoRepository = AppDataSource.getRepository(Pedido);

        const pedidos = await pedidoRepository.find({
            relations: ["pedidoProductos", "pedidoProductos.producto"],
        });

        if (!pedidos || pedidos.length === 0) return [null, "No hay pedidos"];

        return [pedidos, null];
    } catch (error) {
        console.error("Error al obtener los pedidos:", error);
        return [null, "Error interno del servidor"];
    }
}

/**
 * Actualiza un pedido por su ID en la base de datos
 * @param {Object} query - Parámetros de consulta (id)
 * @param {Object} body - Datos del pedido a actualizar
 * @returns {Promise} Promesa con el objeto de pedido actualizado
 */
async function updatePedido(query, body) {
    try {
        const pedidoRepository = AppDataSource.getRepository(Pedido);
        const pedidoProductoRepository = AppDataSource.getRepository(PedidoProducto);

        // Verificar si el pedido existe antes de actualizar
        const pedidoFound = await pedidoRepository.findOne({ where: { id: query.id } });
        if (!pedidoFound) return [null, "Pedido no encontrado"];

        // Actualizar los campos del pedido
        await pedidoRepository.update({ id: pedidoFound.id }, body);

        // Si hay productos, actualizar la relación muchos a muchos
        if (body.productos && body.productos.length > 0) {
            // Eliminar relaciones existentes
            await pedidoProductoRepository.delete({ pedido: { id: pedidoFound.id } });

            // Crear nuevas relaciones
            const pedidoProductos = body.productos.map(({ productoId, cantidad }) => {
                return pedidoProductoRepository.create({
                    pedido: { id: pedidoFound.id },
                    producto: { id: productoId },
                    cantidad: cantidad,
                });
            });

            await pedidoProductoRepository.save(pedidoProductos);
        }

        const updatedPedido = await pedidoRepository.findOne({
            where: { id: query.id },
            relations: ["pedidoProductos", "pedidoProductos.producto"],
        });

        return [updatedPedido, null];
    } catch (error) {
        console.error("Error al modificar un pedido:", error);
        return [null, "Error interno del servidor"];
    }
}

/**
 * Elimina un pedido por su ID de la base de datos
 * @param {Object} query - Parámetros de consulta (id)
 * @returns {Promise} Promesa con el objeto de pedido eliminado
 */
async function deletePedido(query) {
    try {
        const pedidoRepository = AppDataSource.getRepository(Pedido);

        const pedidoFound = await pedidoRepository.findOne({
            where: { id: query.id },
        });

        if (!pedidoFound) return [null, "Pedido no encontrado"];

        await pedidoRepository.remove(pedidoFound);

        return [pedidoFound, null];
    } catch (error) {
        console.error("Error al eliminar un pedido:", error);
        return [null, "Error interno del servidor"];
    }
}

export default {
    createPedido,
    getPedido,
    getPedidos,
    updatePedido,
    deletePedido,
};
