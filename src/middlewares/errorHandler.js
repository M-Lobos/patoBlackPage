import { CustomError } from '../errors/CustomError.js';
import { InternalServerError } from '../errors/TypeError.js';

export const errorHandler = (err, req, res, _next) => {
    if (!(err instanceof CustomError)) {
        err = new InternalServerError(
            err.message || 'Unexpected error',
            500,
            'Please, contact suppert team to check this out, thanks'
        );
    }

    const errorResponse = {
        status: 'Error',
        message: err.message,
        code: err.statusCode,
        details: err.details
    };

    console.error(
        `ERROR: 
            --->${err.message}
            --->Details: ${err.details}
            --->Status: ${err.statusCode}
        `
    );

    res.status(err.statusCode).json(errorResponse);
};