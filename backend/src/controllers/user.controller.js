"use strict";
import UserService from "../services/user.service.js";
import { sendEmailDefault } from "../controllers/email.controller.js";
import { userBodyValidation, userQueryValidation, } from "../validations/user.validation.js";
import {
  handleErrorClient,
  handleErrorServer,
  handleSuccess,
} from "../handlers/responseHandlers.js";
import crypto from "crypto";

/**
 * Crea un nuevo usuario y envía un correo con el enlace para establecer la contraseña
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
export async function createUser(req, res) {
  try {
    const { body } = req;

    // Validar los datos del cuerpo de la solicitud
    const { error } = userBodyValidation.validate(body);
    if (error) return handleErrorClient(res, 400, "Error de validación", error.message);

    // Generar un token único para la verificación (se almacena en el campo 'password')
    const token = crypto.randomBytes(32).toString("hex");

    // Crear el usuario, incluyendo el token en el campo 'password'
    const [user, userError] = await UserService.createUser({
      ...body,
      password: token,
    });

    if (userError) return handleErrorClient(res, 400, "Error de validación", userError);

    // Enviar el correo de confirmación con el enlace para establecer la contraseña
    const resEmail = await sendEmailDefault({
      body: {
        email: body.email,
        subject: "Confirmación de registro en Botillería Santa Elena",
        message: `¡Bienvenido a la plataforma ${user.nombreCompleto}! Para finalizar tu registro, `
                  + "por favor accede al siguiente enlace para establecer tu contraseña: \n\n"
                  + `http://localhost:5173/reset-password/${token}`,
      }
    });

    if (!resEmail.success) {
      console.error("Error enviando el correo:", resEmail.error);
    }

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
    const { id, rut } = req.query;

    const { error } = userQueryValidation.validate({ id, rut });

    if (error) return handleErrorClient(res, 400, "Error de validación", error.message);

    // Enviamos ambos parámetros (id y rut) al servicio
    const [user, errorUser] = await UserService.getUser({ id, rut });

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

/**
* Restablecer la contraseña de un usuario
* @param {Object} req - Objeto de petición
* @param {Object} res - Objeto de respuesta
*/
export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    console.log(token);
    // Verificar que los datos requeridos están presentes
    if (!token || !newPassword) {
      return handleErrorClient(res, 400, "El token y la nueva contraseña son obligatorios.");
    }

    // Buscar al usuario por el token (que está en el campo 'password' del usuario)
    const [user, userError] = await UserService.findUserByPassword(token);
    console.log(token);
    if (userError || !user) {
      return handleErrorClient(res, 400, "La verificación solicitada es inexistente.");
    }

    // Actualizar la contraseña en la base de datos
    const [updatedUser, updateError] = await UserService.updatePassword(user.id, newPassword);

    if (updateError) {
      return handleErrorServer(res, 500, "Error al actualizar la contraseña", updateError.message);
    }

    // Responder con éxito
    handleSuccess(res, 200, "Contraseña actualizada correctamente", updatedUser);
  } catch (error) {
    // Manejar errores no previstos
    handleErrorServer(res, 500, "Error al restablecer la contraseña", error.message);
  }
};

/**
 * Alterna automáticamente el estado de activación de un usuario por su ID
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
export async function toggleUserActiveById(req, res) {
  try {
    const { id } = req.query; // Obtener el ID de la URL

    // Validar que se proporcione un ID válido
    if (!id) return handleErrorClient(res, 400, "El ID del usuario es obligatorio");

    // Llamar al servicio para alternar el estado de activación
    const [user, error] = await UserService.toggleUserActiveById(Number(id));

    if (error) return handleErrorClient(res, 404, error);

    handleSuccess(
      res,
      200,
      `Usuario ${user.isActive ? "activado" : "desactivado"} correctamente`,
      user
    );
  } catch (error) {
    handleErrorServer(res, 500, "Error al alternar el estado del usuario", error.message);
  }
}



export default {
  getUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  resetPassword,
  toggleUserActiveById,
};