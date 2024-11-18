"use strict";
import User from "../entity/user.entity.js";
import { AppDataSource } from "./configDb.js";
import { encryptPassword } from "../helpers/bcrypt.helper.js";

async function createUsers() {
    try {
        const userRepository = AppDataSource.getRepository(User);

        const count = await userRepository.count();
        if (count > 0) return;

        await Promise.all([
        userRepository.save(
            userRepository.create({
            nombreCompleto: "Alexander Carrasco",
            rut: "20.630.735-8",
            email: "alexander.carrasco2101@alumnos.ubiobio.cl",
            password: await encryptPassword("admin123"),
            rol: "Administrador",
            }),
        ),
        ]);
        console.log("* => Usuarios creados exitosamente");
    } catch (error) {
        console.error("Error al crear usuarios:", error);
    }
}

export { createUsers };