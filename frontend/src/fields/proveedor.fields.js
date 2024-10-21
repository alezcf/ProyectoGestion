const proveedorFields = [
  {
    name: "nombre",
    label: "Nombre del Proveedor",
    type: "text",
    placeholder: "Ingresa el nombre del proveedor",
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
    name: "email",
    label: "Correo Electrónico",
    type: "email",
    placeholder: "Ingresa el correo electrónico del proveedor",
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
    name: "telefono",
    label: "Teléfono",
    type: "text",
    placeholder: "Ingresa el teléfono del proveedor",
    validation: {
      required: "El teléfono es obligatorio",
      pattern: {
        value: /^\d{9,15}$/,
        message: "El teléfono debe tener entre 9 y 15 dígitos"
      }
    }
  },
  {
    name: "direccion",
    label: "Dirección",
    type: "text",
    placeholder: "Ingresa la dirección del proveedor",
    validation: {
      required: "La dirección es obligatoria",
      minLength: {
        value: 5,
        message: "Debe tener al menos 5 caracteres"
      },
      maxLength: {
        value: 100,
        message: "No puede tener más de 100 caracteres"
      }
    }
  },
  {
    name: "rut",
    label: "RUT",
    type: "text",
    placeholder: "Ingresa el RUT del proveedor",
    validation: {
      required: "El RUT es obligatorio",
      pattern: {
        value: /^[0-9]+-[0-9Kk]{1}$/,  // Ejemplo de formato RUT: 12345678-9
        message: "El RUT debe estar en formato correcto (ej: 12345678-9)"
      }
    }
  },
];

export default proveedorFields;
