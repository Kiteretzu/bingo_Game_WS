import express, { Request, Response } from 'express';
import gameRoutes from './routes/gameRoutes';

const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// Define the routes with a prefix
app.use('/game', gameRoutes);



export default app;µ