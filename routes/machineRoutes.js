import express from 'express';
import { addMachine, getMachines } from '../controllers/machineController.js';

const router = express.Router();

// Define routes for adding and getting machines
router.route('/').post(addMachine).get(getMachines);

export default router;