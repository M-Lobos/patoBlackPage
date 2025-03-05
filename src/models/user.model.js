import { DataTypes, Model } from "sequelize";
import { v4 as uuidv4 } from 'uuid';
import { hashPassword } from "../services/auth/hash.service.js";

// Define the User class
export class User extends Model { }
export const initializeUser = async (dbConfig) => {
    User.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: uuidv4,  // Generates a new UUID before inserting
                primaryKey: true
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: { msg: "❌ Email already exists " },
                validate: {
                    notEmpty: { msg: "❌ Email cannot be empty " },
                    isEmail: { msg: "❌ Email no valid. " }
                },
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
        modelName: 'User',
        tableName: 'users',
        timestamps: true,
        paranoid: true
    });
    User.sync();

    // Ensure at least one globalAdmin exists
    const globalAdmins = await User.count({ where: { role: "globalAdmin" } });
    if (globalAdmins === 0) {
        if (!process.env.ADMIN_PASSWORD) {
            console.error("❌ ADMIN_PASSWORD is missing in the .env file!");
            process.exit(1);  // Stop the app to prevent security risks
        }

        const hashedPassword = await hashPassword(process.env.ADMIN_PASSWORD);
        await User.create({
            email: process.env.ADMIN_EMAIL || "admin@example.com",
            password: hashedPassword,
            role: "globalAdmin"
        });
        console.log("✅ Default globalAdmin created!");
    }
}

