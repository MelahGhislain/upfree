import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { env } from './utils/methods';
import errorHandlerMiddleware from './middleware/error';

dotenv.config();

export const app = express();

// baody parser
app.use(express.json({ limit: '50mb' }));

app.use(cookieParser());

// Allow specific origins
app.use(cors({ origin: env('CLIENT_PORT') }));

//set express view engine to ejs. this is for mailing purpose
app.set('view engine', 'ejs');

// Test api
app.get('/test', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'This ie a test route to show that the api is working ',
  });
});

// unknown routes
app.all('*', (req: Request, res: Response, next: NextFunction) => {
  const err = new Error(`Route ${req.originalUrl} not found}`) as any;
  err.statusCode = 404;
  next(err);
});

// Handles all errors through the middleware
app.use(errorHandlerMiddleware);
