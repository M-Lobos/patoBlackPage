import * as bcrypt from 'bcrypt';
import { InternalServerError } from '../../errors/TypeError.js';

const SALT_ROUND = 10;

export const hashPassword = async (plainPassword) => {
    try {
        const salt = await bcrypt.genSalt(SALT_ROUND);
        const hashedPassword = await bcrypt.hash(plainPassword, salt);

        return hashedPassword;
    } catch (error) {
        throw new InternalServerError('Cannot encryopt password', 500, error);
    }
};

export const comparePassword = async(plainPassword, hashedPassword) => {
    try {
        const password = await bcrypt.compare(plainPassword, hashedPassword);
        return password;
    } catch (error) {
        throw new InternalServerError('Cannot encrypt password', 500, error);

    }
};