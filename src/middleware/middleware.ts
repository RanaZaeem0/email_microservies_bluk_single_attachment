// src/middleware/errorHandler.ts
import { Request, Response, NextFunction } from "express";
import { z } from "zod";

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
    console.error("Error occurred:", err);

    if (err instanceof z.ZodError) {
        return res.status(400).json({
            success: false,
            message: 'Validation error',
            errors: err.errors
        });
    }

    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'production' ? undefined : err.message
    });
}