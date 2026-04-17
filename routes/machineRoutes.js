import express from 'express';
import { 
    addMachine, 
    getMachines, 
    getMachineById, 
    updateMachine, 
    deleteMachine,
    addVisit,
    getRegionalReport
} from '../controllers/machineController.js';

const router = express.Router();

// General Machine Management
router.route('/')
    .get(getMachines)
    .post(addMachine);

router.route('/:id')
    .get(getMachineById)
    .put(updateMachine)
    .delete(deleteMachine);

// Visit Management
router.post('/visits', addVisit);

// Financial & Compliance Reports
router.get('/reports/regional/:region', getRegionalReport);

export default router;