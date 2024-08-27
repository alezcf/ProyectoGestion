"use strict";
import Vendedor from "../entity/vendedor.entity.js";
import Proveedor from "../entity/proveedor.entity.js";
import { AppDataSource } from "../config/configDb.js";

/**
 * Crea un nuevo vendedor en la base de datos
 * @param {Object} body - Datos del vendedor a crear
 * @returns {Promise} Promesa con el objeto de vendedor creado
 */
export async function createVendedor(body) {
    try {
        const vendedorRepository = AppDataSource.getRepository(Vendedor);
        const proveedorRepository = AppDataSource.getRepository(Proveedor);
    
        // Verificar si el proveedor existe antes de asignarlo al vendedor
        if (body.proveedor_id) {
            const proveedorExists = await proveedorRepository.findOne({
            where: { id: body.proveedor_id },
            });
    
            if (!proveedorExists) {
            return [null, "Proveedor no encontrado"];
            }
        }
    
        // Crear una nueva instancia de Vendedor
        const newVendedor = vendedorRepository.create({
            nombre: body.nombre,
            telefono: body.telefono,
            email: body.email,
            proveedor: body.proveedor_id ? { id: body.proveedor_id } : null,
        });
    
        // Guardar el nuevo vendedor en la base de datos
        const savedVendedor = await vendedorRepository.save(newVendedor);
    
        return [savedVendedor, null];
    } catch (error) {
        console.error("Error al crear el vendedor:", error);
        return [null, "Error interno del servidor"];
    }
}

/**
 * Obtiene un vendedor por su ID o Email de la base de datos
 * @param {Object} query - Parámetros de consulta (id, email)
 * @returns {Promise} Promesa con el objeto de vendedor
 */
async function getVendedor(query) {
    try {
        const { id, email } = query;
        const vendedorRepository = AppDataSource.getRepository(Vendedor);

        const vendedorFound = await vendedorRepository.findOne({
        where: [{ id: id }, { email: email }],
        });

        if (!vendedorFound) return [null, "Vendedor no encontrado"];

        return [vendedorFound, null];
    } catch (error) {
        console.error("Error al obtener el vendedor:", error);
        return [null, "Error interno del servidor"];
    }
}

/**
 * Obtiene todos los vendedores de la base de datos
 * @returns {Promise} Promesa con el objeto de los vendedores
 */
async function getVendedores() {
    try {
        const vendedorRepository = AppDataSource.getRepository(Vendedor);

        const vendedores = await vendedorRepository.find();

        if (!vendedores || vendedores.length === 0) return [null, "No hay vendedores"];

        return [vendedores, null];
    } catch (error) {
        console.error("Error al obtener a los vendedores:", error);
        return [null, "Error interno del servidor"];
    }
}

/**
 * Actualiza un vendedor en la base de datos
 * @param {Object} query - Parámetros de consulta (id, email)
 * @param {Object} body - Datos a actualizar
 * @returns {Promise} Promesa con el objeto de vendedor actualizado
 */
export async function updateVendedor(query, body) {
    try {
        const { id, email } = query;
        const vendedorRepository = AppDataSource.getRepository(Vendedor);
        const proveedorRepository = AppDataSource.getRepository(Proveedor);
    
        // Verificar si el vendedor existe
        const vendedorFound = await vendedorRepository.findOne({
            where: [{ id: id }, { email: email }],
        });
    
        if (!vendedorFound) {
            return [null, "Vendedor no encontrado"];
        }
    
        // Verificar si el nuevo proveedor_id existe
        if (body.proveedor_id) {
            const proveedorExists = await proveedorRepository.findOne({
            where: { id: body.proveedor_id },
            });
    
            if (!proveedorExists) {
            return [null, "Proveedor no encontrado"];
            }
    
            // Asignar el proveedor a la entidad Vendedor
            vendedorFound.proveedor = proveedorExists;
        }
    
        // Actualizar los campos del vendedor
        vendedorRepository.merge(vendedorFound, body);
    
        // Guardar los cambios
        const updatedVendedor = await vendedorRepository.save(vendedorFound);
    
        return [updatedVendedor, null];
    } catch (error) {
        console.error("Error al actualizar el vendedor:", error);
        return [null, "Error interno del servidor"];
    }
}

/**
 * Elimina un vendedor por su ID o Email de la base de datos
 * @param {Object} query - Parámetros de consulta (id, email)
 * @returns {Promise} Promesa con el objeto de vendedor eliminado
 */
async function deleteVendedor(query) {
    try {
        const { id, email } = query;
        const vendedorRepository = AppDataSource.getRepository(Vendedor);

        const vendedorFound = await vendedorRepository.findOne({
        where: [{ id: id }, { email: email }],
        });

        if (!vendedorFound) return [null, "Vendedor no encontrado"];

        const vendedorDeleted = await vendedorRepository.remove(vendedorFound);

        return [vendedorDeleted, null];
    } catch (error) {
        console.error("Error al eliminar un vendedor:", error);
        return [null, "Error interno del servidor"];
    }
}

export default {
    createVendedor,
    getVendedor,
    getVendedores,
    updateVendedor,
    deleteVendedor,
};
