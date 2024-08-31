import { strict as assert } from "assert";
import { test } from "node:test";
import sinon from "sinon";
import InventarioService from "../src/services/inventario.service.js";
import { createInventario } from "../src/controllers/inventario.controller.js";

test("should create an inventario successfully", async () => {
    const req = {
        body: {
            nombre: "Inventario de prueba",
            stock_actual: 180,
            maximo_stock: 300,
            productos: [
                { id: 16, cantidad: 100 },
                { id: 17, cantidad: 50 },
                { id: 18, cantidad: 30 },
            ],
        },
    };
    const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
    };

    // Mocking the service method to return a successful creation
    const stub = sinon.stub(InventarioService, "createInventario").resolves([{ nombre: "Inventario de prueba" }, null]);

    // Call the controller method
    await createInventario(req, res);

    // Assertions
    assert(res.status.calledWith(201), "Expected status 201");
    assert(res.json.calledWith(sinon.match({ id: 1, nombre: "Inventario Central" })), "Expected json response with created inventario");

    // Restore the stubbed method
    stub.restore();
});
