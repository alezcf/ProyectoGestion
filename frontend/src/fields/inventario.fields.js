const inventarioFields = [
    {
        name: "nombre",
        label: "NOMBRE (*)",
        type: "text",
        placeholder: "Ingresa el nombre del inventario",
        tooltip: "Introduce el nombre del inventario. Debe tener entre 3 y 100 caracteres y no puede ser solo números.",
        validation: {
            required: "El nombre es obligatorio",
            minLength: {
                value: 3,
                message: "Debe tener al menos 3 caracteres"
            },
            maxLength: {
                value: 100,
                message: "No puede tener más de 100 caracteres"
            },
            validate: {
                notOnlyNumbers: (value) =>
                    !/^\d+$/.test(value) || "El nombre no puede contener solo números"
            }
        }
    },
    {
        name: "maximo_stock",
        label: "MÁXIMO STOCK",
        type: "number",
        placeholder: "Ingresa el máximo stock",
        tooltip: "Define el stock máximo permitido. Debe ser mayor que 0.",
        validation: {
            required: "El máximo stock es obligatorio",
            min: {
                value: 2,
                message: "La capacidad minima es 2."
            },
            max: {
                value: 1500,
                message: "La capacidad maxima es 1500."
            },
        }
    }
];

export default inventarioFields;
