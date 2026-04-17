import mongoose from 'mongoose';

const visitSchema = new mongoose.Schema({
    // Link this visit to a specific machine using its ID
    machineId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Machine', 
        required: true 
    },
    // The exact date of the visit (e.g., 12/1/2027)
    actualVisitDate: { 
        type: Date, 
        required: true 
    },
    // Technical report details
    reportSummary: { type: String, trim: true },
    // Fixed cost per visit as you mentioned (1066.66)
    visitCost: { type: Number, default: 1066.66 }
}, { timestamps: true });

const Visit = mongoose.model('Visit', visitSchema);
export default Visit;