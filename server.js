import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import Connection_db from './models/Connection_db.js';
import machineRoutes from './routes/machineRoutes.js';
import userRoutes from './routes/userRoutes.js';
import visitsRoutes from './routes/visitsRoutes.js';
import { notFound, errorHandler } from './middleware/errorHandling.js';
// 1. Load configurations
dotenv.config();

// 2. Connect to Database
Connection_db(); 

const app = express();

// 3. Middlewares
app.use(cors());
app.use(express.json());

// 4. Routes
app.get('/', (req, res) => {
    res.send('Maintenance System API is active!');
});


// Use machine routes for all /api/machines endpoints
app.use('/api/machines', machineRoutes);
app.use('/api/visits', visitsRoutes);
app.use('/api/users', userRoutes);


// 5. Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

// 6. Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(` Server is running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});
