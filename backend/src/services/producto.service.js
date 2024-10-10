"use strict";
import Producto from "../entity/producto.entity.js";
import Proveedor from "../entity/proveedor.entity.js";
import ProductoProveedor from "../entity/producto_proveedor.entity.js";
import fs from "fs";
import path from "path";
import { AppDataSource } from "../config/configDb.js";
import { In } from "typeorm";

/**
 * Crea un nuevo producto en la base de datos
 * @param {Object} body - Datos del producto
 * @returns {Promise} Promesa con el objeto de producto creado o un error si los proveedores no existen
 */
async function createProducto(body) {
    try {
        const productoRepository = AppDataSource.getRepository(Producto);
        const proveedorRepository = AppDataSource.getRepository(Proveedor);
        const productoProveedorRepository = AppDataSource.getRepository(ProductoProveedor);

        // Verificar si los proveedores existen solo si se proporcionan
        let proveedores = [];
        if (body.proveedores && body.proveedores.length > 0) {
            proveedores = await proveedorRepository.findBy({
                id: In(body.proveedores),
            });

            if (proveedores.length !== body.proveedores.length) {
                return [null, "Uno o más proveedores no existen"];
            }
        }

        // Corregir la barra invertida en la ruta de la imagen
        if (body.imagen_ruta) {
            body.imagen_ruta = body.imagen_ruta.replace(/\\/g, "/");
        }

        // Crear el producto
        const newProducto = productoRepository.create(body);
        const savedProducto = await productoRepository.save(newProducto);

        // Crear las relaciones en la tabla producto_proveedor
        if (proveedores.length > 0) {
            const productoProveedores = proveedores.map(proveedor => {
                return {
                    producto: savedProducto,  // Relacionar con el producto recién creado
                    proveedor: proveedor
                };
            });

            // Guardar todas las relaciones en la tabla intermedia
            await productoProveedorRepository.save(productoProveedores);
        }

        return [savedProducto, null];
    } catch (error) {
        console.error("Error al crear un producto:", error);
        return [null, "Error interno del servidor"];
    }
}

/**
 * Obtiene un producto por su ID de la base de datos
 * @param {Object} query - Parámetros de consulta (id)
 * @returns {Promise} Promesa con el objeto de producto
 */
async function getProducto(query) {
    try {
        const { id } = query;
        const productoRepository = AppDataSource.getRepository(Producto);

        const productoFound = await productoRepository.findOne({
            where: { id: id },
        });

        if (!productoFound) return [null, "Producto no encontrado"];

        return [productoFound, null];
    } catch (error) {
        console.error("Error al obtener el producto:", error);
        return [null, "Error interno del servidor"];
    }
}

/**
 * Obtiene todos los productos de la base de datos
 * @returns {Promise} Promesa con el objeto de los productos
 */
async function getProductos() {
    try {
        const productoRepository = AppDataSource.getRepository(Producto);

        const productos = await productoRepository.find();

        if (!productos || productos.length === 0) return [null, "No hay productos"];

        return [productos, null];
    } catch (error) {
        console.error("Error al obtener los productos:", error);
        return [null, "Error interno del servidor"];
    }
}

/**
 * Actualiza un producto por su ID en la base de datos
 * @param {Object} query - Parámetros de consulta (id)
 * @param {Object} body - Datos del producto a actualizar
 * @returns {Promise} Promesa con el objeto de producto actualizado o un error
 */
async function updateProducto(query, body) {
    try {
        const { id } = query;
        const productoRepository = AppDataSource.getRepository(Producto);
        const proveedorRepository = AppDataSource.getRepository(Proveedor);
        const productoProveedorRepository = AppDataSource.getRepository(ProductoProveedor);

        // Verificar si el producto existe antes de actualizar
        const productoFound = await productoRepository.findOne({
            where: { id: id },
            relations: ["productoProveedores", "productoInventarios"]
        });

        if (!productoFound) {
            return [null, "Producto no encontrado"];
        }

        // Extraer los proveedores y la imagen del cuerpo de la solicitud
        const { proveedores, imagen_ruta: nuevaImagen, ...productoData } = body;

        // Si se proporciona una nueva imagen, procesar la actualización
        if (nuevaImagen) {
            // Reemplazar las barras invertidas por barras inclinadas en la nueva imagen
            const imagenRutaNormalizada = nuevaImagen.replace(/\\/g, "/");

            const imagenActualRuta = productoFound.imagen_ruta;

            if (imagenActualRuta) {
                const filePath = path.resolve(imagenActualRuta);

                if (fs.existsSync(filePath)) {
                    fs.unlink(filePath, (err) => {
                        if (err) {
                            console.error("Error eliminando la imagen registrada:", err);
                        } else {
                            console.log("Imagen registrada eliminada:", filePath);
                        }
                    });
                }
            }

            productoFound.imagen_ruta = imagenRutaNormalizada;
        }

        // Actualizar los campos del producto que no están relacionados con proveedores
        Object.assign(productoFound, productoData);
        await productoRepository.update({ id: productoFound.id }, productoData);

                // Actualizar la relación muchos a muchos (proveedores)
            if (proveedores && proveedores.length > 0) {
            // Encontrar las entidades de los proveedores por los IDs proporcionados
            const proveedoresEntities = await proveedorRepository.findBy({
                id: In(proveedores),
            });

            if (proveedoresEntities.length !== proveedores.length) {
                return [null, "Uno o más proveedores no existen"];
            }
            // Crear nuevas relaciones en la tabla intermedia `producto_proveedor`
            const nuevasRelaciones = proveedoresEntities.map(proveedor => {
            return productoProveedorRepository.create({
                producto: productoFound,  // Relacionar con el producto existente
                proveedor: proveedor     // Relacionar con el proveedor existente
            });
        });
            await productoProveedorRepository.save(nuevasRelaciones);
            productoFound.productoProveedores = nuevasRelaciones;
        } else {
            // Si no se proporcionan proveedores, eliminar todas las relaciones
            await productoProveedorRepository.delete({ producto: { id: productoFound.id } });
            productoFound.productoProveedores = [];
        }
        await productoRepository.update({ id: productoFound.id }, productoData);
        // Guardar el producto actualizado
        const productoActualizado = await productoRepository.save(productoFound);

        return [productoActualizado, null];
    } catch (error) {
        console.error("Error al modificar un producto:", error);
        return [null, "Error interno del servidor"];
    }
}

/**
 * Elimina un producto por su ID de la base de datos
 * @param {Object} query - Parámetros de consulta (id)
 * @returns {Promise} Promesa con el objeto de producto eliminado
 */
async function deleteProducto(query) {
    try {
        const { id } = query;
        const productoRepository = AppDataSource.getRepository(Producto);

        const productoFound = await productoRepository.findOne({
            where: { id: id },
        });

        if (!productoFound) return [null, "Producto no encontrado"];

        const imagenRuta = productoFound.imagen_ruta;

        if (imagenRuta) {
            const filePath = path.resolve(imagenRuta);
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error("Error eliminando la imagen:", err);
                } else {
                    console.log("Imagen eliminada:", filePath);
                }
            });
        }

        const productoDeleted = await productoRepository.remove(productoFound);

        return [productoDeleted, null];
    } catch (error) {
        console.error("Error al eliminar un producto:", error);
        return [null, "Error interno del servidor"];
    }
}

export default {
    createProducto,
    getProducto,
    getProductos,
    updateProducto,
    deleteProducto,
};