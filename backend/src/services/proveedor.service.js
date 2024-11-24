"use strict";
import Proveedor from "../entity/proveedor.entity.js";
import { AppDataSource } from "../config/configDb.js";
import { format, validate } from "rut.js"

/**
 * Crea un nuevo proveedor en la base de datos
 * @param {Object} body - Datos del proveedor
 * @returns {Promise} Promesa con el objeto de proveedor creado
 */
async function createProveedor(body) {
    try {
        const proveedorRepository = AppDataSource.getRepository(Proveedor);

        const existingProveedor = await proveedorRepository.findOne({
        where: [{ rut: body.rut }, { email: body.email }],
        });

        if (existingProveedor) {
        return [null, "Ya existe un proveedor con el mismo rut o email"];
        }

        if(!validate(format(body.rut))){
            return [null, "El rut de proveedor ingresado es invalido."];
        }
        const newProveedor = proveedorRepository.create({
            nombre: body.nombre,
            rut: format(body.rut), // Aplica formato al RUT
            direccion: body.direccion,
            telefono: body.telefono,
            email: body.email,
        });

        const savedProveedor = await proveedorRepository.save(newProveedor);

        return [savedProveedor, null];
    } catch (error) {
        console.error("Error al crear un proveedor:", error);
        return [null, "Error interno del servidor"];
    }
}

/**
 * Obtiene un proveedor por su ID, RUT o Email de la base de datos
 * @param {Object} query - Parámetros de consulta (id, rut, email)
 * @returns {Promise} Promesa con el objeto de proveedor
 */
async function getProveedor(query) {
    try {
        const { rut, id, email } = query;
        const proveedorRepository = AppDataSource.getRepository(Proveedor);

        const proveedorFound = await proveedorRepository.findOne({
        where: [{ id: id }, { rut: rut }, { email: email }],
        });

        if (!proveedorFound) return [null, "Proveedor no encontrado"];

        return [proveedorFound, null];
    } catch (error) {
        console.error("Error al obtener el proveedor:", error);
        return [null, "Error interno del servidor"];
    }
}

/**
 * Obtiene todos los proveedores de la base de datos
 * @returns {Promise} Promesa con el objeto de los proveedores
 */
async function getProveedores() {
    try {
        const proveedorRepository = AppDataSource.getRepository(Proveedor);

        const proveedores = await proveedorRepository.find();

        if (!proveedores || proveedores.length === 0) return [null, "No hay proveedores"];

        return [proveedores, null];
    } catch (error) {
        console.error("Error al obtener a los proveedores:", error);
        return [null, "Error interno del servidor"];
    }
}

/**
 * Actualiza un proveedor por su ID, RUT o Email en la base de datos
 * @param {Object} query - Parámetros de consulta (id, rut, email)
 * @param {Object} body - Datos del proveedor a actualizar
 * @returns {Promise} Promesa con el objeto de proveedor actualizado
 */
async function updateProveedor(query, body) {
    try {
        const { id, rut, email } = query;
        const proveedorRepository = AppDataSource.getRepository(Proveedor);

        // Verificar si el proveedor existe antes de actualizar
        const proveedorFound = await proveedorRepository.findOne({
        where: [{ id: id }, { rut: rut }, { email: email }],
        });

        if (!proveedorFound) {
        return [null, "Proveedor no encontrado"];
        }

        // Verificar si ya existe un proveedor con el mismo RUT o email, excluyendo el actual
        const existingProveedor = await proveedorRepository.findOne({
        where: [{ rut: body.rut }, { email: body.email }],
        });

        if (existingProveedor && existingProveedor.id !== proveedorFound.id) {
        return [null, "Ya existe un proveedor con el mismo rut o email"];
        }

        await proveedorRepository.update({ id: proveedorFound.id }, body);

        const proveedorData = await proveedorRepository.findOne({
        where: { id: proveedorFound.id },
        });

        if (!proveedorData) {
        return [null, "Error al recuperar el proveedor actualizado"];
        }

        return [proveedorData, null];
    } catch (error) {
        console.error("Error al modificar un proveedor:", error);
        return [null, "Error interno del servidor"];
    }
}

/**
 * Elimina un proveedor por su ID, RUT o Email de la base de datos
 * @param {Object} query - Parámetros de consulta (id, rut, email)
 * @returns {Promise} Promesa con el objeto de proveedor eliminado
 */
async function deleteProveedor(query) {
    try {
        const { id, rut, email } = query;
        const proveedorRepository = AppDataSource.getRepository(Proveedor);

        const proveedorFound = await proveedorRepository.findOne({
        where: [{ id: id }, { rut: rut }, { email: email }],
        });

        if (!proveedorFound) return [null, "Proveedor no encontrado"];

        const proveedorDeleted = await proveedorRepository.remove(proveedorFound);

        return [proveedorDeleted, null];
    } catch (error) {
        console.error("Error al eliminar un proveedor:", error);
        return [null, "Error interno del servidor"];
    }
}

export default {
    createProveedor,
    getProveedor,
    getProveedores,
    updateProveedor,
    deleteProveedor,
};
