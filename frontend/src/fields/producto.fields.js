const validCategorias = [
  "Cerveza",
  "Vino",
  "Licor",
  "Gaseosa",
  "Néctar",
  "Pisco",
  "Ron",
  "Whisky",
  "Agua mineral",
  "Cigarrillo",
  "Snack",
  "Otro"
];

const validUnidadesMedida = ["ML", "GR", "U", "L"];

const validTipos = ["Alcohólico", "Sin Alcohol", "Otro"];

const productoFields = [
  {
    name: "nombre",
    label: "NOMBRE (*)",
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
    name: "descripcion",
    label: "DESCRIPCIÓN",
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
  },
  {
    name: "marca",
    label: "MARCA",
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
    name: "contenido",
    label: "CONTENIDO",
    type: "text",
    placeholder: "Ingresa el contenido del producto",
    validation: {
      required: "El contenido es obligatorio",
      minLength: {
        value: 1,
        message: "Debe tener al menos 1 carácter"
      },
      maxLength: {
        value: 20,
        message: "No puede tener más de 20 caracteres"
      }
    }
  },
  {
    name: "unidad_medida",
    label: "UNIDAD DE MEDIDA",
    type: "select",
    options: validUnidadesMedida.map(unidad => ({
      value: unidad,
      label: unidad
    })),
    validation: {
      required: "La unidad de medida es obligatoria"
    }
  },
  {
    name: "precio",
    label: "PRECIO",
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
    name: "categoria",
    label: "CATEGORÍA (*)",
    type: "select",
    options: validCategorias.map(categoria => ({
      value: categoria,
      label: categoria
    })),
    validation: {
      required: "La categoría es obligatoria"
    }
  },
  {
    name: "tipo_producto",
    label: "TIPO DE PRODUCTO (*)",
    type: "select",
    options: validTipos.map(tipo => ({
      value: tipo,
      label: tipo
    })),
    validation: {
      required: "El tipo de producto es obligatorio"
    }
  }
];

export default productoFields;