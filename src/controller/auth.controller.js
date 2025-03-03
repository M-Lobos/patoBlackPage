import { User } from '../models/User.model.js';
import { loginService } from '../services/auth/login.service.js'; 
import { AuthError } from '../errors/TypeError.js';


// This file is under construction yet
/* import { registerService } from '../services/auth/register.service.js';

export const register = async(req, res, next) => {
    try {
        const user = await registerService(req.body, User);
        
        res.status(201).json({
            message: 'User registred successfully 🦆 ',
            status: 201,
            data: user //just for testing purposes, delete later
        });

    } catch (error) {
        throw new AuthError('Error in login User', 500, error);
    }
}; */

export const login = async(req, res, next) => {
    try {
        const { user, token } = await loginService(req.body);

        res.status(202).json({
            message: 'User authenticated successfully 🦆',
            status: 202,
            data: { user, token }
        });
    } catch (error) {
        console.error('Login Error:', error);  // <-- Log the real error
        next(error);  // <-- Pass the original error instead of wrapping it
        /* next(new AuthError('Error in login User', 500, error)); */
    }
};



