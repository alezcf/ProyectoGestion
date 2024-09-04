import multer from "multer";
import path from "path";

// Configuración de almacenamiento
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

// Filtros de archivos (opcional, para limitar tipos de archivos permitidos)
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb(new Error("Solo se permiten imágenes con formato jpeg, jpg, png o gif"));
    }
};

// Inicialización de multer con la configuración
const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 }, // Limitar el tamaño de la imagen a 5MB
    fileFilter: fileFilter,
});

export default upload;
