import { dbConfig } from "../config/db.config.js";
import { initModels } from "../utils/db/initModels.js";
import { InternalServerError } from "../errors/TypeError.js";

export const dbConnection = async () => {
    try {
        await dbConfig.authenticate();
        initModels(dbConfig);
        await dbConfig.sync({ alter: true })

        console.log('Conection to Postgres from Sequelize ⚫🦆')
    } catch (error) {
        throw new InternalServerError('Something exploded 💀', 500, 'We cannot connect from sequelize to DB, look up for the obvious reasons first; DB name, endpoints, etc');
    }
}