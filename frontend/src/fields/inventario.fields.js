const inventarioFields = [
    {
        name: "nombre",
        label: "NOMBRE (*)",
        type: "text",
        placeholder: "Ingresa el nombre del inventario",
        tooltip: "Introduce el nombre del inventario. Debe tener entre 3 y 50 caracteres.",
        validation: {
            required: "El nombre es obligatorio",
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
        name: "maximo_stock",
        label: "MÁXIMO STOCK",
        type: "number",
        placeholder: "Ingresa el máximo stock",
        tooltip: "Define el stock máximo permitido. Debe ser mayor que 0.",
        validation: {
            required: "El máximo stock es obligatorio",
            min: {
                value: 1,
                message: "Debe ser mayor que 0"
            }
        }
    }
];

export default inventarioFields;
