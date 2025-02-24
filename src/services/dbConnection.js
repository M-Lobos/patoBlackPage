import { dbConfig } from "../config/db.config.js";

export const dbConnection = async () => {
    try {
        await dbConfig.authenticate();
        await dbConfig.sync({ alter: true })

        console.log('Conection to Postgres from Sequelize ⚫🦆')
    } catch (error) {
        console.error('Something exploded 💀', error);
        process.exit(1)
    }
}