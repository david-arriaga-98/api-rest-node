import express from 'express';
import { config } from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import database from './config/db';
import { errorResponse } from './utils/responses';

const app = express();

// Configs
config();
database();
app.set('port', process.env.PORT || 3000);

// Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Routes
import userRouter from './routes/user.router';
app.use(userRouter);

// 404 error
app.use((req, res) => {
	const errResponse = errorResponse('Esta página no existe', 404, 'not found');
	res.status(errResponse.code).json(errResponse);
});

export default app;
