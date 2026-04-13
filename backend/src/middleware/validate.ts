import type { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

/** Validate req.body against a Zod schema */
export function validateBody<T>(schema: ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        res.status(400).json({
          error: 'Validation failed',
          issues: err.issues.map(i => ({ path: i.path.join('.'), message: i.message })),
        });
        return;
      }
      next(err);
    }
  };
}
