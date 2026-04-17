
import Machine from '../models/Machine.js';

// @desc    Add a new machine
// @route   POST /api/machines
export const addMachine = async (req, res) => {
    try {
        const { serialNumber, branchName, region } = req.body;

        // Check if machine already exists
        const machineExists = await Machine.findOne({ serialNumber });
        if (machineExists) {
            return res.status(400).json({ message: 'Machine with this Serial Number already exists' });
        }

        const machine = await Machine.create({
            serialNumber,
            branchName,
            region
        });

        res.status(201).json(machine);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get all machines
// @route   GET /api/machines
export const getMachines = async (req, res) => {
    try {
        const machines = await Machine.find({});
        res.json(machines);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};