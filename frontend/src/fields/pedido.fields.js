const pedidoFields = [
  {
    name: "fecha_pedido",
    label: "Fecha del Pedido",
    type: "date",
    placeholder: "Selecciona la fecha del pedido",
    tooltip: "Selecciona la fecha en la que se realizó el pedido.",
    validation: {
      required: "La fecha del pedido es obligatoria",
    }
  },
  {
    name: "estado",
    label: "Estado del Pedido",
    type: "select",
    options: [
      { value: "", label: "Selecciona un estado" }, // Opción predeterminada
      { value: "Pendiente", label: "Pendiente" },
      { value: "Completo", label: "Completo" },
      { value: "Cancelado", label: "Cancelado" }
    ],
    placeholder: "Selecciona el estado del pedido",
    tooltip: "Indica el estado actual del pedido: Pendiente, Completo o Cancelado.",
    validation: {
      required: "El estado es obligatorio"
    },
    defaultValue: "Pendiente" // Ajusta a tu necesidad o usa el valor actual en el formulario
  }
];

export default pedidoFields;
