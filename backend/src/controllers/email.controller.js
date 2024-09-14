import { sendEmail } from "../services/email.service.js";
import { emailValidationSchema } from "../validations/email.validation.js";
import {
    handleErrorClient,
    handleErrorServer,
    handleSuccess,
    } from "../handlers/responseHandlers.js";

export const sendCustomEmail = async (req, res) => {
    try {
        const { body } = req;
        const { error } = emailValidationSchema.validate(req.body);

        if (error) return handleErrorClient(res, 400, "Error de validación", error.message);

        const [ email, errorEmail ] = await sendEmail(body);

        if(errorEmail) return handleErrorClient(res, 400, errorEmail);

        handleSuccess(res, 200, "Correo enviado con éxito.", email);
    } catch (error) {
        handleErrorServer(res, 500, "Error durante el envío de correo.", error.message);
    }
};

export const sendEmailDefault = async (req) => {
    try {
        const { body } = req;
        
        // Validación del esquema del email
        const { error: validationError } = emailValidationSchema.validate(body);
        if (validationError) {
            return {
                success: false,
                error: validationError.message
            };
        }

        const [email, errorEmail] = await sendEmail(body);
        if (errorEmail) {
            return {
                success: false,
                error: errorEmail 
            };
        }

        return {
            success: true,
            data: email
        };

    } catch (error) {
        // Captura de cualquier error no previsto
        return {
            success: false,
            error: error.message
        };
    }
};
