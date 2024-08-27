"use strict";
import User from "../entity/user.entity.js";
import { AppDataSource } from "../config/configDb.js";
import { comparePassword, encryptPassword } from "../helpers/bcrypt.helper.js";

export async function createUserService(body) {
  try {
    const userRepository = AppDataSource.getRepository(User);

    const existingUser = await userRepository.findOne({
      where: [{ rut: body.rut }, { email: body.email }],
    });

    if (existingUser) {
      return [null, "Ya existe un usuario con el mismo rut o email"];
    }

    const newUser = userRepository.create({
      nombreCompleto: body.nombreCompleto,
      rut: body.rut,
      email: body.email,
      rol: body.rol,
      password: await encryptPassword(body.password),
    });

    const savedUser = await userRepository.save(newUser);

    const { password, ...userData } = savedUser;

    return [userData, null];
  } catch (error) {
    console.error("Error al crear un usuario:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function getUserService(query) {
  try {
    const { rut, id, email } = query;

    const userRepository = AppDataSource.getRepository(User);

    const userFound = await userRepository.findOne({
      where: [{ id: id }, { rut: rut }, { email: email }],
    });

    if (!userFound) return [null, "Usuario no encontrado"];

    const { password, ...userData } = userFound;

    return [userData, null];
  } catch (error) {
    console.error("Error obtener el usuario:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function getUsersService() {
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

export async function updateUserService(query, body) {
  try {
    const { id, rut, email } = query;

    const userRepository = AppDataSource.getRepository(User);

    const userFound = await userRepository.findOne({
      where: [{ id: id }, { rut: rut }, { email: email }],
    });

    if (!userFound) return [null, "Usuario no encontrado"];

    const existingUser = await userRepository.findOne({
      where: [{ rut: body.rut }, { email: body.email }],
    });

    if (existingUser && existingUser.id !== userFound.id) {
      return [null, "Ya existe un usuario con el mismo rut o email"];
    }

    const matchPassword = await comparePassword(
      body.password,
      userFound.password,
    );

    if (!matchPassword) return [null, "La contraseña no coincide"];

    const updatedParam = id ? { id } : rut ? { rut } : { email };

    const updateData = {
      nombreCompleto: body.nombreCompleto,
      rut: body.rut,
      email: body.email,
      rol: body.rol,
      password: await encryptPassword(body.newPassword || body.password),
      updatedAt: new Date(),
    };

    await userRepository.update(updatedParam, updateData);

    const userData = await userRepository.findOne({
      where: [updatedParam],
    });

    const { password, ...userUpdated } = userData;

    return [userUpdated, null];
  } catch (error) {
    console.error("Error al modificar un usuario:", error);
    return [null, "Error interno del servidor"];
  }
}


export async function deleteUserService(query) {
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