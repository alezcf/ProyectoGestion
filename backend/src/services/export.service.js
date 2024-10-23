import exceljs from "exceljs";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

// Estas dos líneas reemplazan el uso de __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Exporta un array de objetos a un archivo Excel
 * @param {Array} arrayData - Array de objetos a exportar
 * @returns {Promise} Promesa que resuelve con la ruta del archivo Excel o un error
 */
export async function exportArrayToExcel(arrayData) {
    try {
        const workbook = new exceljs.Workbook();
        const worksheet = workbook.addWorksheet("Datos Exportados");

        // Agregar encabezados de la tabla (basados en las keys del primer objeto del array)
        const headers = Object.keys(arrayData[0]);
        worksheet.columns = headers.map(header => ({
            header,
            key: header,
            width: Math.max(
                ...arrayData.map(data => data[header]?.toString().length || 10),
                header.length
            ) + 5
        }));

        // Estilos para el encabezado
        worksheet.getRow(1).eachCell((cell) => {
            cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FF4CAF50" }, // Color de fondo (verde oscuro)
                bgColor: { argb: "FF000000" }  // Color de fondo alternativo
            };
            cell.font = {
                bold: true,
                color: { argb: "FFFFFFFF" } // Color de fuente (blanco)
            };
            cell.alignment = { vertical: "middle", horizontal: "center" }; // Alineación
        });

        // Agregar filas y aplicar estilos alternos
        arrayData.forEach((data, index) => {
            const rowData = {};
            for (const key in data) {
                // Verificar que todos los campos estén llenos, si no, asignar "No registrado"
                rowData[key] = data[key] === null || data[key] === "" ? "No registrado" : data[key];
            }
            const row = worksheet.addRow(rowData);

            // Estilo de fondo para filas alternas
            const fillColor = index % 2 === 0 ? "FFFFFFFF" : "FFEEEEEE"; // Blanco y gris claro

            row.eachCell((cell) => {
                cell.fill = {
                    type: "pattern",
                    pattern: "solid",
                    fgColor: { argb: fillColor },
                };
                cell.alignment = { vertical: "middle", horizontal: "center" }; // Alineación
            });
        });

        // Asegurarse de que el directorio tmp exista
        const tmpDir = path.join(__dirname, "../tmp");
        if (!fs.existsSync(tmpDir)) {
            fs.mkdirSync(tmpDir);
        }

        // Guardar el archivo
        const filePath = path.join(tmpDir, "exported_data.xlsx");
        await workbook.xlsx.writeFile(filePath);

        return [filePath, null];
    } catch (error) {
        console.error("Error al exportar a Excel:", error);
        return [null, "Error interno al exportar a Excel"];
    }
}

export default {
    exportArrayToExcel,
};
