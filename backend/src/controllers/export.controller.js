import { handleErrorServer } from "../handlers/responseHandlers.js";
import { exportArrayToExcel } from "../services/export.service.js";

/**
 * Recibe un array y lo exporta a una tabla Excel y envía el archivo al cliente
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
export async function exportToExcel(req, res) {
    try {
        const { arrayData } = req.body;

        if (!arrayData || !Array.isArray(arrayData)) {
            return handleErrorServer(
                res,
                400,
                "Error de validación",
                "El cuerpo de la petición debe contener un array"
            );
        }

        const [filePath, error] = await exportArrayToExcel(arrayData);

        if (error) {
            return handleErrorServer(res, 500, "Error exportando datos a Excel", error);
        }

        // Envía el archivo directamente al cliente y maneja el posible error de envío
        res.download(filePath, "usuarios_export.xlsx", (err) => {
            if (err) {
                console.error("Error enviando el archivo:", err);
                handleErrorServer(res, 500, "Error al descargar el archivo", err.message);
            }
        });
    } catch (error) {
        handleErrorServer(res, 500, "Error exportando a Excel", error.message);
    }
}


export default {
    exportToExcel,
};
