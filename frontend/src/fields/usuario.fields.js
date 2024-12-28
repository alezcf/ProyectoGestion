const usuarioFields = [
    {
        name: "nombreCompleto",
        label: "NOMBRE COMPLETO (*)",
        type: "text",
        placeholder: "Ingresa el nombre completo",
        tooltip: "Introduce el nombre completo del usuario. Debe tener entre 3 y 50 caracteres.",
        validation: {
            required: "El nombre completo es obligatorio",
            minLength: {
                value: 3,
                message: "Debe tener al menos 3 caracteres"
            },
            maxLength: {
                value: 50,
                message: "No puede tener más de 50 caracteres"
            }
        }
    },
    {
        name: "email",
        label: "CORREO ELECTRÓNICO (*)",
        type: "email",
        placeholder: "Ingresa el correo electrónico",
        tooltip: "Introduce el correo electrónico en un formato válido (ejemplo@dominio.com).",
        validation: {
            required: "El correo electrónico es obligatorio",
            pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Formato de correo inválido"
            },
            minLength: {
                value: 10,
                message: "Debe tener al menos 10 caracteres"
            },
            maxLength: {
                value: 50,
                message: "No puede tener más de 50 caracteres"
            }
        }
    },
    {
        name: "rut",
        label: "RUT (*)",
        type: "text",
        placeholder: "Ingresa el RUT",
        tooltip: "Introduce el RUT en formato válido, como xx.xxx.xxx-x o x.xxx.xxx-x.",
        validation: {
            required: "El RUT es obligatorio",
            pattern: {
                value: /^\d{1,2}\.?\d{3}\.?\d{3}-[\dkK]$/,  // Expresión regular para RUT
                message: "Formato de RUT inválido. Ejemplo: xx.xxx.xxx-x o x.xxx.xxx-x"
            },
            minLength: {
                value: 9,
                message: "Debe tener al menos 9 caracteres"
            },
            maxLength: {
                value: 12,
                message: "No puede tener más de 12 caracteres"
            }
        }
    },
    {
        name: "rol",
        label: "ROL (*)",
        type: "select",
        options: [
            { value: "Administrador", label: "Administrador" },
            { value: "Empleado", label: "Empleado" }
        ],
        tooltip: "Selecciona el rol del usuario: Administrador o Empleado.",
        validation: {
            required: "El rol es obligatorio"
        }
    }
];

export default usuarioFields;
