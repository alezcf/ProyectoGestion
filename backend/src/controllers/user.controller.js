"use strict";
import UserService from "../services/user.service.js";
import { userBodyValidation, userQueryValidation, } from "../validations/user.validation.js";
import {
  handleErrorClient,
  handleErrorServer,
  handleSuccess,
} from "../handlers/responseHandlers.js";

/**
 * Crea un nuevo usuario
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
export async function createUser(req, res) {
  try {
    const { body } = req;

    const { error } = userBodyValidation.validate(body);

    if (error) return handleErrorClient(res, 400, "Error de validación", error.message);

    const [user, userError] = await UserService.createUser(body);

    if (userError) return handleErrorClient(res, 400, userError);

    handleSuccess(res, 201, "Usuario creado correctamente", user);
  } catch (error) {
    handleErrorServer(res, 500, "Error creando un usuario", error.message);
  }
}

/**
 * Obtiene un usuario por su RUT, ID o Email
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
export async function getUser(req, res) {
  try {
    const { rut } = req.query;

    const { error } = userQueryValidation.validate({ rut });

    if (error) return handleErrorClient(res, 400, "Error de validación", error.message);

    const [user, errorUser] = await UserService.getUser({ rut });

    if (errorUser) return handleErrorClient(res, 404, errorUser);

    handleSuccess(res, 200, "Usuario encontrado", user);
  } catch (error) {
    handleErrorServer(res, 500, "Error obteniendo un usuario", error.message);
  }
}

/**
 * Obtiene todos los usuarios
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
export async function getUsers(req, res) {
  try {
    const [users, errorUsers] = await UserService.getUsers();

    if (errorUsers) return handleErrorClient(res, 404, errorUsers);

    users.length === 0
      ? handleSuccess(res, 204)
      : handleSuccess(res, 200, "Usuarios encontrados", users);
  } catch (error) {
    handleErrorServer(res, 500, "Error obteniendo a los usuarios", error.message);
  }
}

/**
 * Actualiza un usuario por su RUT, ID o Email
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
export async function updateUser(req, res) {
  try {
    const { rut, id, email } = req.query;
    const { body } = req;

    const { error: queryError } = userQueryValidation.validate({ rut, id, email });

    if (queryError) {
      return handleErrorClient(res, 400, "Error de validación", queryError.message);
    }

    const { error: bodyError } = userBodyValidation.validate(body);

    if (bodyError) return handleErrorClient(res, 400, "Error de validación", bodyError.message);

    const [user, userError] = await UserService.updateUser({ rut, id, email }, body);

    if (userError) return handleErrorClient(res, 400, userError);

    handleSuccess(res, 200, "Usuario modificado correctamente", user);
  } catch (error) {
    handleErrorServer(res, 500, "Error modificando un usuario", error.message);
  }
}

/**
 * Elimina un usuario por su RUT, ID o Email
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
export async function deleteUser(req, res) {
  try {
    const { rut, id, email } = req.query;

    const { error: queryError } = userQueryValidation.validate({ rut, id, email });

    if (queryError) {
      return handleErrorClient(res, 400, "Error de validación", queryError.message);
    }

    const [userDelete, errorUserDelete] = await UserService.deleteUser({ rut, id, email });

    if (errorUserDelete) return handleErrorClient(res, 404, errorUserDelete);

    handleSuccess(res, 200, "Usuario eliminado correctamente", userDelete);
  } catch (error) {
    handleErrorServer(res, 500, "Error eliminando un usuario", error.message);
  }
}

export default {
  getUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
};