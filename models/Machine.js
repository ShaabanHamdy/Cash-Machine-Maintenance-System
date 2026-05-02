
import mongoose from 'mongoose';

const machineSchema = new mongoose.Schema({
    serialNumber: { 
        type: String, 
        required: [true, 'Serial number is mandatory'], 
        unique: true, 
        trim: true,
        uppercase: true, //  Standardization (S123 is same as s123)
        index: true 
    },
    branchName: { 
        type: String, 
        required: [true, 'Branch name must be specified'], 
        trim: true,
        minLength: [2, 'Branch name is too short']
    },
    region: { 
        type: String, 
        required: [true, 'Region is required for reporting'], 
        trim: true,
        index: true // Essential for filtering machines by region
    },
    status: { 
        type: String, 
        required: true,
        enum: {
            values: ['Active', 'Broken', 'Under Maintenance'],
            message: '{VALUE} is not a supported status'
        },
        default: 'Active' 
    }
}, { 
    timestamps: true,
    versionKey: false 
});

// Virtual field: Can be used to get all visits for this machine easily
machineSchema.virtual('visits', {
    ref: 'Visit',
    localField: '_id',
    foreignField: 'machineId'
});

const Machine = mongoose.model('Machine', machineSchema);
export default Machine;