"use strict";
import User from "../entity/user.entity.js"; // Modelo de usuario
import { AppDataSource } from "../config/configDb.js";
import { encryptPassword } from "../helpers/bcrypt.helper.js";
import { format, validate } from "rut.js"

/**
 * Crea un nuevo usuario en la base de datos
 * @param {Object} body - Datos del usuario
 * @returns {Promise} Promesa con el objeto de usuario creado
 */
async function createUser(body) {
  try {
    const userRepository = AppDataSource.getRepository(User);

    const existingUser = await userRepository.findOne({
      where: [{ rut: format(body.rut) }, { email: body.email }],
    });

    if (existingUser) {
      return [null, "Ya existe un usuario con el mismo rut o email"];
    }

    // Digito verificador invalido retorna error.
    if(!validate(format(body.rut))){
      return [null, "El rut ingresado es invalido."];
    }

    const newUser = userRepository.create({
      nombreCompleto: body.nombreCompleto,
      rut: format(body.rut),
      email: body.email,
      rol: body.rol,
      password: body.password,
    });

    const savedUser = await userRepository.save(newUser);

    const { password, ...userData } = savedUser;

    return [userData, null];
  } catch (error) {
    console.error("Error al crear un usuario:", error);
    return [null, "Error interno del servidor"];
  }
}
/**
 * Obtiene un usuario por su ID, RUT o Email de la base de datos
 * @param {Object} query - Parámetros de consulta (id, rut)
 * @returns {Promise} Promesa con el objeto de usuario
 */
async function getUser(query) {
  try {
    const { id, rut } = query;
    const userRepository = AppDataSource.getRepository(User);

    // Hacemos la búsqueda por ID o RUT (cualquiera que exista)
    const userFound = await userRepository.findOne({
      where: [
        { id: id },    // Busca por ID
        { rut: rut },  // O busca por RUT
      ],
    });

    if (!userFound) return [null, "Usuario no encontrado"];

    const { password, ...userData } = userFound; // Excluye el campo de la contraseña

    return [userData, null];
  } catch (error) {
    console.error("Error al obtener el usuario:", error);
    return [null, "Error interno del servidor"];
  }
}

/**
 * Obtiene todos los usuarios de la base de datos
 * @returns {Promise} Promesa con el objeto de los usuarios
 */
async function getUsers() {
  try {
    const userRepository = AppDataSource.getRepository(User);

    const users = await userRepository.find();

    if (!users || users.length === 0) return [null, "No hay usuarios"];

    const usersData = users.map(({ password, ...user }) => user);

    return [usersData, null];
  } catch (error) {
    console.error("Error al obtener a los usuarios:", error);
    return [null, "Error interno del servidor"];
  }
}

/**
 * Actualiza un usuario por su ID, RUT o Email en la base de datos
 * @param {Object} query - Parámetros de consulta (id, rut, email)
 * @param {Object} body - Datos del usuario a actualizar
 * @returns {Promise} Promesa con el objeto de usuario actualizado
 */
async function updateUser(query, body) {
  try {
    const { id, rut, email } = query;
    const userRepository = AppDataSource.getRepository(User);

    // Verificar si el usuario existe antes de actualizar
    const userFound = await userRepository.findOne({
      where: [{ id: id }, { rut: rut }, { email: email }],
    });

    if (!userFound) {
      return [null, "Usuario no encontrado"];
    }


    // Verificar si ya existe un usuario con el mismo RUT o email, excluyendo el actual
    const existingUser = await userRepository.findOne({
      where: [{ rut: body.rut }, { email: body.email }],
    });

    if (existingUser && existingUser.id !== userFound.id) {
      return [null, "Ya existe un usuario con el mismo rut o email"];
    }

    if(!validate(format(body.rut))){
      return [null, "El rut ingresado es invalido."];
    }

    const updateData = {
      nombreCompleto: body.nombreCompleto,
      rut: format(body.rut),
      email: body.email,
      rol: body.rol,
      updatedAt: new Date(),
    };

    if (body.newPassword) {
      updateData.password = await encryptPassword(body.newPassword);
    }


    await userRepository.update({ id: userFound.id }, updateData);

    const userData = await userRepository.findOne({
      where: { id: userFound.id },
    });

    if (!userData) {
      return [null, "Error al recuperar el usuario actualizado"];
    }

    // Eliminar la contraseña del objeto antes de retornarlo
    const { password, ...userUpdated } = userData;

    return [userUpdated, null];
  } catch (error) {
    console.error("Error al modificar un usuario:", error);
    return [null, "Error interno del servidor"];
  }
}

/**
 * Elimina un usuario por su ID, RUT o Email de la base de datos
 * @param {Object} query - Parámetros de consulta (id, rut, email)
 * @returns {Promise} Promesa con el objeto de usuario eliminado
 */
async function deleteUser(query) {
  try {
    const { id, rut, email } = query;
    const userRepository = AppDataSource.getRepository(User);

    const userFound = await userRepository.findOne({
      where: [{ id: id }, { rut: rut }, { email: email }],
    });

    if (!userFound) return [null, "Usuario no encontrado"];

    if (userFound.rol === "administrador") {
      return [null, "No se puede eliminar un usuario con rol de administrador"];
    }

    const userDeleted = await userRepository.remove(userFound);

    const { password, ...dataUser } = userDeleted;

    return [dataUser, null];
  } catch (error) {
    console.error("Error al eliminar un usuario:", error);
    return [null, "Error interno del servidor"];
  }
}

/**
 * Buscar un usuario por el campo password (usado temporalmente como token)
 * @param {String} token - Token de validación
 * @returns {Promise} Promesa con el usuario encontrado o un error
 */
export const findUserByPassword = async (token) => {
  try {
    const userRepository = AppDataSource.getRepository(User);

    // Buscar al usuario por el token encriptado en el campo 'password'
    const user = await userRepository.findOne({
      where: { password: token }
    });

    if (!user) {
      return [null, "Token inválido o no encontrado"];
    }

    return [user, null];
  } catch (error) {
    return [null, error];
  }
};

/**
 * Actualizar la contraseña de un usuario
 * @param {Number} userId - ID del usuario
 * @param {String} newPassword - Nueva contraseña encriptada
 * @returns {Promise} Promesa con el usuario actualizado o un error
 */
export const updatePassword = async (userId, newPassword) => {
  try {
    const userRepository = AppDataSource.getRepository(User);
    console.log("new password", newPassword);
    // Actualizar la contraseña en la base de datos
    const user = await userRepository.update(
      { id: userId },
      { password: await encryptPassword(newPassword) }
    );

    return [user, null];
  } catch (error) {
    return [null, error];
  }
};

/**
 * Alterna automáticamente el estado de activación de un usuario por su ID
 * @param {Number} id - ID del usuario
 * @returns {Promise} Promesa con el usuario actualizado
 */
async function toggleUserActiveById(id) {
  try {
    const userRepository = AppDataSource.getRepository(User);

    // Buscar el usuario por su ID
    const userFound = await userRepository.findOne({ where: { id } });

    if (!userFound) return [null, "Usuario no encontrado"];

    // Alternar el estado de activación
    userFound.isActive = !userFound.isActive;
    await userRepository.save(userFound);

    // Retornar el usuario actualizado (sin incluir la contraseña)
    const { password, ...updatedUser } = userFound;
    return [updatedUser, null];
  } catch (error) {
    console.error("Error al alternar el estado del usuario:", error);
    return [null, "Error interno del servidor"];
  }
}



export default {
  createUser,
  getUser,
  getUsers,
  updateUser,
  deleteUser,
  findUserByPassword,
  updatePassword,
  toggleUserActiveById,
};
