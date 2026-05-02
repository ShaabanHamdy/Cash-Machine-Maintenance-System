import express from "express";
import {
  addMachine,
  getAllMachines,
  getMachineById,
  updateMachineById,
  deleteOneMachineById,
  deleteAllData,
} from "../controllers/machineController.js";

const router = express.Router();
// General Machine Management
router.route("/").get(getAllMachines).post(addMachine).delete(deleteAllData);

router
  .route("/:id")
  .get(getMachineById)
  .put(updateMachineById)
  .delete(deleteOneMachineById);

export default router;
