import { max } from "date-fns";

const productoFields = [
  {
    name: "nombre",
    label: "NOMBRE (*)",
    type: "text",
    placeholder: "Ingresa el nombre del producto",
    tooltip: "Introduce el nombre del producto. Debe tener entre 3 y 50 caracteres.",
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
    tooltip: "Introduce una descripción breve. Debe tener entre 10 y 200 caracteres.",
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
    tooltip: "Especifica la marca del producto. Debe tener entre 2 y 50 caracteres.",
    validation: {
      maxLength: {
        value: 50,
        message: "No puede tener más de 50 caracteres",
      },
    },
    onBlur: (e, setValue) => {
      if (e.target.value.trim() === "") {
        setValue("marca", null);
      }
    },
  },

  {
    name: "contenido",
    label: "CONTENIDO",
    type: "text",
    placeholder: "Ingresa el contenido del producto",
    tooltip: "Cantidad de contenido en unidades. Máximo 20 caracteres.",
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
    options: [
      { value: "ML", label: "ML" },
      { value: "GR", label: "GR" },
      { value: "U", label: "U" },
      { value: "L", label: "L" }
    ],
    tooltip: "Selecciona la unidad de medida para el contenido del producto.",
    validation: {
      required: "La unidad de medida es obligatoria"
    }
  },
  {
    name: "precio",
    label: "PRECIO",
    type: "number",
    placeholder: "Ingresa el precio del producto",
    tooltip: "Introduce el precio del producto, mayor a 0.",
    validation: {
      required: "El precio es obligatorio",
      min: {
        value: 10,
        message: "El precio mínimo es 10."
      },
      max : {
        value: 1000000,
        message: "El precio máximo es 1.000.000"
      }
    }
  },
  {
    name: "categoria",
    label: "CATEGORÍA (*)",
    type: "select",
    options: [
      { value: "Cerveza", label: "Cerveza" },
      { value: "Vino", label: "Vino" },
      { value: "Licor", label: "Licor" },
      { value: "Gaseosa", label: "Gaseosa" },
      { value: "Néctar", label: "Néctar" },
      { value: "Pisco", label: "Pisco" },
      { value: "Ron", label: "Ron" },
      { value: "Whisky", label: "Whisky" },
      { value: "Agua mineral", label: "Agua mineral" },
      { value: "Cigarrillo", label: "Cigarrillo" },
      { value: "Snack", label: "Snack" },
      { value: "Otro", label: "Otro" }
    ],
    tooltip: "Selecciona una categoría para el producto.",
    validation: {
      required: "La categoría es obligatoria"
    }
  },
  {
    name: "tipo",
    label: "TIPO DE PRODUCTO (*)",
    type: "select",
    options: [
      { value: "Alcohólico", label: "Alcohólico" },
      { value: "Sin Alcohol", label: "Sin Alcohol" },
      { value: "Otro", label: "Otro" }
    ],
    tooltip: "Selecciona el tipo de producto (Alcohólico, Sin Alcohol, Otro).",
    validation: {
      required: "El tipo de producto es obligatorio"
    }
  }
];

export default productoFields;
