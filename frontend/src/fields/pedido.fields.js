const pedidoFields = [
  {
    name: "fecha_pedido",
    label: "Fecha del Pedido",
    type: "date",  // Permite seleccionar solo la fecha
    placeholder: "Selecciona la fecha del pedido",
    validation: {
      required: "La fecha del pedido es obligatoria",
    }
  },
  {
    name: "estado",
    label: "Estado del Pedido",
    type: "select",
    options: [
      { value: "pendiente", label: "Pendiente" },
      { value: "completo", label: "Completo" },
      { value: "cancelado", label: "Cancelado" }
    ],
    placeholder: "Selecciona el estado del pedido",
    validation: {
      required: "El estado es obligatorio"
    }
  }
];

export default pedidoFields;
