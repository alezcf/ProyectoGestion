import { Router } from "express";
import { exportToExcel } from "../controllers/export.controller.js";

const router = Router();

router.post("/export", exportToExcel);

export default router;
