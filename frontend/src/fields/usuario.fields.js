const usuarioFields = [
    {
        name: "nombreCompleto",
        label: "NOMBRE COMPLETO (*)",
        type: "text",
        placeholder: "Ingresa el nombre completo",
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
        validation: {
            required: "El correo electrónico es obligatorio",
            pattern: {
            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            message: "Formato de correo inválido"
            },
            minLength: {
            value: 20,
            message: "Debe tener al menos 20 caracteres"
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
        validation: {
            required: "El RUT es obligatorio",
            pattern: {
            value: /^\d{1,2}\.?\d{3}\.?\d{3}-[\dkK]$/,
            message: "Formato de RUT inválido"
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
        validation: {
            required: "El rol es obligatorio"
        }
    }
];

export default usuarioFields;
