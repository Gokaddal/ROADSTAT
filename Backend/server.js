// server.js
import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import db from './src/Db/database.js';
import cors from 'cors'; // Import CORS middleware
const app = express();
const PORT = process.env.PORT || 3000;
const __dirname = path.resolve();
dotenv.config({path: __dirname + '/.env'}); // Load environment variables from .env file
db.connect(); // Connect to the database

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

import userRouter from './src/Routes/userRoute.js';
import authRouter from './src/Routes/authRoute.js'
import collisionHistoryRouter from './src/Routes/collisionHistoryRoute.js';
import destinationRouter from './src/Routes/destinationRoute.js';
import driverRouter from './src/Routes/driverRoute.js';
import driverHealthRouter from './src/Routes/driverHealthRoute.js';
import truckLocationRouter from './src/Routes/truckLocationRoute.js';
import trailerDetailsRouter from './src/Routes/trailerDetailsRoute.js';
import trackLocationRouter from './src/Routes/trackLocationRoute.js';
import truckControlRouter from './src//Routes/truckControlRoute.js';
import truckDetailsRouter from './src/Routes/truckDetailsRoute.js';
import truckInformationRouter from './src/Routes/truckInfoRoute.js';
import truckEfficiencyRouter from './src/Routes/truckEfficiencyRoute.js'
import trailerLocationRouter from './src/Routes/trailerLocationRoute.js';
import EngineHealthRouter from './src/Controllers/maintenance/Engine-health.js';
import brakeSystemRouter from './src/Controllers/maintenance/Brake-system.js';
import fuelSystemRouter from './src/Controllers/maintenance/Fuel-system.js';
import tireHealthRouter from './src/Controllers/maintenance/Tire-health.js';
import batteryStatusRouter from './src/Controllers/maintenance/Battery-status.js';
import trucksMetricsRouter from './src/Routes/truckMetricsRoute.js';
import transmissionRouter from  './src/Controllers/maintenance/Transmission-status.js';

// import transmissionRouter from  './src/api/maintenance/Transmission-status.js';


app.get('/api', (req, res) => {
  res.send('Welcome to the Truck Management System API');
});

app.use('/api/auth', authRouter)
app.use('/api/user', userRouter);
app.use('/api/collision-history', collisionHistoryRouter);
app.use('/api/destination', destinationRouter); 
app.use('/api/driver-health', driverHealthRouter); 
app.use('/api/driver', driverRouter);
app.use('/api/truck-location', truckLocationRouter);
app.use('/api/track-location', trackLocationRouter);
app.use('/api/truck-info', truckInformationRouter);
app.use('/api/truck-control', truckControlRouter);
app.use('/api/trailer-details', trailerDetailsRouter);
app.use('/api/truck-efficiency', truckEfficiencyRouter);
app.use('/api/truck-details', truckDetailsRouter);
app.use('/api/truck-metrics', trucksMetricsRouter);
app.use('/api/trailer-location', trailerLocationRouter);

/**
 * 

app.use('/api', EngineHealthRouter);
app.use('/api', brakeSystemRouter);
app.use('/api', fuelSystemRouter);
app.use('/api', tireHealthRouter);
app.use('/api', batteryStatusRouter);
app.use('/api', transmissionRouter);**/

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});