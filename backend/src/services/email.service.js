import nodemailer from "nodemailer";
import { emailConfig } from "../config/configEnv.js";
/**
 * Crea un nuevo inventario en la base de datos
 * @param {Object} body - Datos del correo electrónico
 * @returns {Promise} Promesa con el objeto email creado o un error
 */

export const sendEmail = async (body) => {
    try {
        const { email, subject, message } = body;

        const newEmail = ({
            from: `"Botilleria Santa Elena" <${emailConfig.user}>`,
            to: email,
            subject: subject,
            text: message,
            html: `<p>${message}</p>`
        });

        const transporter = nodemailer.createTransport({
            service: emailConfig.service,
            auth: {
                user: emailConfig.user,
                pass: emailConfig.pass,
            },
        });

        await transporter.sendMail(newEmail);

        return [newEmail, null];
    } catch (error) {
        return [null, error];
    }
};