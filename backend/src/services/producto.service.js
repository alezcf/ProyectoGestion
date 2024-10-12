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

        console.log(body);
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
            where: { id: id }
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

        // Separar la responsabilidad de encontrar el producto
        const productoFound = await findProductoById(id);
        if (!productoFound) {
            return [null, "Producto no encontrado"];
        }

        // Actualizar la imagen si es necesario
        const updatedProducto = await handleImageUpdate(productoFound, body.imagen_ruta);

        // Actualizar los campos restantes del producto
        const productoActualizado = await updateProductData(updatedProducto, body);

        return [productoActualizado, null];
    } catch (error) {
        console.error("Error al modificar un producto:", error);
        return [null, "Error interno del servidor"];
    }
}

// 1. Single Responsibility Principle (SRP): Encuentra el producto
async function findProductoById(id) {
    const productoRepository = AppDataSource.getRepository(Producto);
    return productoRepository.findOne({ where: { id } });
}

// 2. Single Responsibility Principle (SRP): Maneja la actualización de la imagen
async function handleImageUpdate(producto, nuevaImagen) {
    if (nuevaImagen && nuevaImagen !== producto.imagen_ruta) {
        const imagenRutaNormalizada = normalizeImagePath(nuevaImagen);

        // Eliminar la imagen actual si existe
        await deleteExistingImage(producto.imagen_ruta);

        // Asignar la nueva imagen al producto
        producto.imagen_ruta = imagenRutaNormalizada;
    } else if (!nuevaImagen) {
        // Eliminar referencia a la imagen si es necesario
        producto.imagen_ruta = null;
    }

    return producto;
}

// 3. Open/Closed Principle (OCP): Normalizar la ruta de la imagen
function normalizeImagePath(imagen_ruta) {
    return imagen_ruta.replace(/\\/g, "/");
}

// 4. Single Responsibility Principle (SRP): Eliminar la imagen existente
async function deleteExistingImage(imagenRuta) {
    if (imagenRuta) {
        const filePath = path.resolve(imagenRuta);
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
}

// 5. Single Responsibility Principle (SRP): Actualiza los datos del producto
async function updateProductData(productoFound, productoData) {
    const productoRepository = AppDataSource.getRepository(Producto);

    // Actualizar los campos del producto
    Object.assign(productoFound, productoData);

    // Guardar el producto actualizado
    return productoRepository.save(productoFound);
}


/**
 * Actualiza solo la imagen de un producto por su ID
 * @param {Object} query - Parámetros de consulta (id)
 * @param {Object} params - Objeto que contiene nuevaImagenRuta y eliminarImagen
 * @returns {Promise} Promesa con el objeto de producto actualizado o un error
 */
async function updateProductoImagen(query, { nuevaImagenRuta, eliminarImagen }) {
    try {
        const { id } = query;
        console.log("ID:", id);
        const productoRepository = AppDataSource.getRepository(Producto);
        console.log("ahora estamos en la linea 2034 del service");
        // Buscar el producto en la base de datos
        const productoFound = await findProductoById(id);
        if (!productoFound) {
            return [null, "Producto no encontrado"];
        }

        // Si se solicita eliminar la imagen existente
        if (eliminarImagen && productoFound.imagen_ruta) {
            await deleteExistingImage(productoFound.imagen_ruta);
            productoFound.imagen_ruta = null;
        }

        // Si se envía una nueva imagen, reemplazar la actual
        if (nuevaImagenRuta && nuevaImagenRuta !== productoFound.imagen_ruta) {
            await deleteExistingImage(productoFound.imagen_ruta);
            productoFound.imagen_ruta = normalizeImagePath(nuevaImagenRuta);
        }

        // Guardar el producto actualizado
        const productoActualizado = await productoRepository.save(productoFound);
        return [productoActualizado, null];
    } catch (error) {
        console.error("Error al actualizar la imagen del producto:", error);
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
    updateProductoImagen
};