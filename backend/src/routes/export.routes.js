import { Router } from "express";
import { exportToExcel } from "../controllers/export.controller.js";
import { exportObjectAndArrays } from "../controllers/export.controller.js";

const router = Router();

router.post("/export", exportToExcel);
router.post("/exportObject", exportObjectAndArrays);


export default router;
