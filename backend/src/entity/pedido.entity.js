import { EntitySchema } from "typeorm";
import Proveedor from "./proveedor.entity.js";
import Inventario from "./inventario.entity.js"; // Asegúrate de tener esta entidad definida

const PedidoSchema = new EntitySchema({
    name: "Pedido",
    tableName: "pedidos",
    columns: {
        id: {
            type: "int",
            primary: true,
            generated: true,
        },
        fecha_pedido: {
            type: "timestamp",
            nullable: false,
            default: () => "CURRENT_TIMESTAMP",
        },
        estado: {
            type: "varchar",
            length: 50,
            nullable: false,
        },
    },
    relations: {
        proveedor: {
            target: Proveedor,
            type: "many-to-one",
            joinColumn: { name: "proveedor_id" },
            nullable: false,
            eager: true,
        },
        inventarioAsignado: {
            target: Inventario,
            type: "many-to-one",
            joinColumn: { name: "inventario_asignado_id" },
            nullable: false,
            eager: true,
        },
        pedidoProductos: {
            target: "PedidoProducto",
            type: "one-to-many",
            inverseSide: "pedido",
        },
    },
});

export default PedidoSchema;
