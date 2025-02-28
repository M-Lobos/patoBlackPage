import { CustomError } from './CustomError.js';

export class InternalServerError extends CustomError {
    constructor(message, statusCode, details) {
        super(
            message || 'Internal server error ❌',
            statusCode || 500,
            details || 'Well ahm... somehting  went wrong, obviously');
    }
}

export class DataBaseError extends CustomError {
    constructor(message, statusCode, details) {
        super(
            message || 'Something exploded 💀',
            statusCode || 500,
            details || 'error'
        );
    }
}

export class ValidateError extends CustomError {
    constructor(message, statusCode, details) {
        super(message || 'Error de Validación', statusCode || 400, details);
    }
}

/* export class NotFound extends CustomError {
    constructor(message, details, entity) {
        super(message || `${entity} No encontrado`, 404, details);
    }
} */

export class AuthError extends CustomError {
    constructor(message, statusCode, details) {
        super(
            message || 'Error processing authentication request',
            statusCode || 500,
            details
        );
    }
};