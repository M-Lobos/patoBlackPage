import { DataTypes, Model } from "sequelize";
import { v4 as uuidv4 } from 'uuid';

// Define the User class
export class User extends Model { }
export const initializeUser = (dbConfig) => {
    User.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: uuidv4,  // Generates a new UUID before inserting
            primaryKey: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        role: {
            type: DataTypes.ENUM('globalAdmin', 'admin'),
            allowNull: false
        }
    }, {
        sequelize: dbConfig,
        modelName: 'User'
    });
    User.sync();
}