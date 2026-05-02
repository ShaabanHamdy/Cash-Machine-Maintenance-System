import express from "express";
import {
  addVisit,
  getVisitsByMachineId,
  getMaintenanceReport,
  getRegionalReport,
} from "../controllers/visitsController.js";

const router = express.Router();
// Visit Management
router.post("/", addVisit);

// Get visits for a specific machine
router.get("/:machineId", getVisitsByMachineId);

// Financial & Compliance Reports
router.get("/reports/regional/:region", getRegionalReport);

// Maintenance Report for a specific machine
router.get("/reports/maintenance", getMaintenanceReport);

export default router;
