
import mongoose from 'mongoose';

const visitSchema = new mongoose.Schema({
    machineId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Machine', 
        required: [true, 'Machine ID is required to log a visit'],
        index: true //  Adding index for faster search/reports
    },
    
    actualVisitDate: { 
        type: Date, 
        required: [true, 'Visit date is required'],
        default: Date.now 
    },
    reportSummary: { 
        type: String, 
        trim: true,
        maxLength: [1000, 'Report summary cannot exceed 1000 characters']
    },
    visitCost: { 
        type: Number, 
        default: 1066.66,
        min: [0, 'Visit cost cannot be negative'] // Validation for data integrity
    },
    engineerName: { // Added: Useful for tracking who did the job
        type: String,
        trim: true
    }
}, { 
    timestamps: true,
    versionKey: false // Removes the __v field from documents
});

// Middleware: Update machine status if needed (Optional Logic)
// visitSchema.post('save', async function() { ... });

const Visit = mongoose.model('Visit', visitSchema);
export default Visit;