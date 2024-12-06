"use strict";
import User from "../entity/user.entity.js";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../config/configDb.js";
import { comparePassword, encryptPassword } from "../helpers/bcrypt.helper.js";
import { ACCESS_TOKEN_SECRET } from "../config/configEnv.js";

export async function loginService(user) {
  try {
    const userRepository = AppDataSource.getRepository(User);

    const { email, password } = user;

    const userFound = await userRepository.findOne({
      where: {
        email: email,
      },
    });

    if (!userFound) return [null, "El email ingresado no existe."];

    const isMatch = await comparePassword(password, userFound.password);

    if (!isMatch) return [null, "La contraseña ingresada es incorrecta"];

    const payload = {
      fullname: userFound.nombreCompleto,
      email: userFound.email,
      rut: userFound.rut,
      rol: userFound.rol,
    };

    const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, {
      expiresIn: "1d",
    });

    return [accessToken, null];
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function registerService(user) {
  try {
    const userRepository = AppDataSource.getRepository(User);

    const { nombreCompleto, rut, email, password } = user;

    const existingUser = await userRepository.findOne({
      where: {
        email,
      },
    });

    if (existingUser) return [null, "El usuario ya existe"];

    const newUser = userRepository.create({
      nombreCompleto,
      email,
      rut,
      password: await encryptPassword(password),
      rol: "usuario",
    });

    await userRepository.save(newUser);

    return [newUser, null];
  } catch (error) {
    console.error("Error al registrar un usuario", error);
    return [null, "Error interno del servidor"];
  }
}