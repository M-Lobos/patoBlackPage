import jwt from 'jsonwebtoken';

import { User } from '../../models/User.model.js';
import { comparePassword } from './hash.service.js';
import { config } from '../../config/env.config.js';
import { normalizeUserPrivateData } from '../../utils/normalize/userNorm.js';
import { AuthError } from '../../errors/TypeError.js';

const { secretKey } = config;

export const loginService = async({ email, password }) => {
    try {
        const user = await User.findOne({ where: { email } });
        console.log('User Found:', user);
        if (!user) {
            throw new AuthError('Usuario no encontrado', 404);
        }

        const passwordMatch = await comparePassword(password, user.password);
        console.log('Password Match:', passwordMatch);
        if (!passwordMatch) {
            throw new AuthError('Contraseña incorrecta', 401);
        }

        const privateUser  = normalizeUserPrivateData(user);
        
        const token = jwt.sign(
            { 
                id: user.id, 
                email: user.email,
                role: user.role
            }, 
            secretKey,
            { expiresIn: '1h' }
        );
        

        return {
            token,
            user: privateUser 
        };
    } catch (error) {
        throw new AuthError('Login not authorized', 500, error); 
    }
};