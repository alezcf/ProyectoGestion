const productoFields = [
  {
    name: "marca",
    label: "Marca del Producto",
    type: "text",
    placeholder: "Ingresa la marca del producto",
    validation: {
      required: "La marca es obligatoria",
      minLength: {
        value: 2,
        message: "Debe tener al menos 2 caracteres"
      },
      maxLength: {
        value: 50,
        message: "No puede tener más de 50 caracteres"
      }
    }
  },
  {
    name: "nombre",
    label: "Nombre del Producto",
    type: "text",
    placeholder: "Ingresa el nombre del producto",
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
    name: "codigo",
    label: "Código del Producto",
    type: "text",
    placeholder: "Ingresa el código del producto",
    validation: {
      required: "El código es obligatorio",
      pattern: {
        value: /^[A-Za-z0-9-]+$/,
        message: "El código solo puede contener letras, números y guiones"
      },
      minLength: {
        value: 3,
        message: "Debe tener al menos 3 caracteres"
      },
      maxLength: {
        value: 20,
        message: "No puede tener más de 20 caracteres"
      }
    }
  },
  {
    name: "categoria",
    label: "Categoría del Producto",
    type: "text",
    placeholder: "Ingresa la categoría del producto",
    validation: {
      required: "La categoría es obligatoria",
      minLength: {
        value: 3,
        message: "Debe tener al menos 3 caracteres"
      },
      maxLength: {
        value: 30,
        message: "No puede tener más de 30 caracteres"
      }
    }
  },
  {
    name: "precio",
    label: "Precio del Producto",
    type: "number",
    placeholder: "Ingresa el precio del producto",
    validation: {
      required: "El precio es obligatorio",
      min: {
        value: 0.01,
        message: "El precio debe ser mayor que 0"
      }
    }
  },
  {
    name: "descripcion",
    label: "Descripción del Producto",
    type: "textarea",
    placeholder: "Ingresa una descripción del producto",
    validation: {
      required: "La descripción es obligatoria",
      minLength: {
        value: 10,
        message: "Debe tener al menos 10 caracteres"
      },
      maxLength: {
        value: 200,
        message: "No puede tener más de 200 caracteres"
      }
    }
  }
];

export default productoFields;
