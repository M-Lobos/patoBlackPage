import { dbConnection } from "./dbConnection.js";
import { InternalServerError } from "../errors/TypeError.js";

export const serverInitialization = async (app, port) => {
    try {
        console.log('verifying database connection ⌛🦆');
        await dbConnection();
        app.listen(port, () => {
            console.log(`server running at port ${port} ⬛🦆`);
        })
    } catch (error) {
        throw new InternalServerError('Something exploded 💀', 500, 'We cannot connect to server')
    }
}
