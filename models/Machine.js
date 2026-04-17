import mongoose from 'mongoose';

const machineSchema = new mongoose.Schema({
    serialNumber: { type: String, required: true, unique: true, trim: true },
    branchName: { type: String, required: true, trim: true },
    region: { type: String, required: true, trim: true },
    status: { type: String, enum: ['Active', 'Broken'], default: 'Active' }
}, { timestamps: true });

const Machine = mongoose.model('Machine', machineSchema);
export default Machine;