import { NextFunction, Request, Response } from 'express';

// Catches all aync errors
export const CatchAsyncError =
  (func: any) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(func(req, res, next)).catch(next);
  };
