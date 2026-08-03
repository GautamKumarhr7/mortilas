import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  const statusCode =
    (err as Error & { statusCode?: number }).statusCode ?? 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
};
