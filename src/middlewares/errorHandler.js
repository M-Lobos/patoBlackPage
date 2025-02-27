import { CustomError } from '../errors/CustomError.js';
import { InternalServerError } from '../errors/TypeError.js';

export const errorHandler = (err, req, res, _next) => {
    if (!(err instanceof CustomError)) {
        err = new InternalServerError(
            err.message || 'Unexpected error',
            500,
            'Please, contact support team to check this out, thanks 🦆' 
        );
    }

    const errorResponse = {
        status: 'Error',
        message: err.message,
        code: err.statusCode || 500, // Fallback for safety
        details: err.details || 'No additional details'
    };

    console.error(
        `ERROR: 
            ---> ${err.message}
            ---> Details: ${err.details || 'N/A'}
            ---> Status: ${err.statusCode || 500}
        `
    );

    res.status(err.statusCode || 500).json(errorResponse);
};
