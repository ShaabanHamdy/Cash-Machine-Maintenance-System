
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import Conection_db from './models/Conection_db.js';
import machineRoutes from './routes/machineRoutes.js';

// Load environment variables from .env file
dotenv.config();

const app = express();

// Middlewares to handle CORS and JSON parsing
app.use(cors());
app.use(express.json());



Conection_db(); // Connect to MongoDB

// Define Port and MongoDB URI from environment variables
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Basic route for testing the API status
app.get('/', (req, res) => {
    res.send('Maintenance System API is active!');
});
app.use('/api/machines', machineRoutes);