import { dbConnection } from "./dbConnection.js";

export const serverInitialization = async (app, port) => {
    try {
        console.log('verifying database connection ⌛🦆');
        await dbConnection()
        app.listen(port, () => {
            console.log(`server running at port ${port} ⬛🦆`);
        })
    } catch (error) {
        console.error('Error initializing server', error);
        process.exit(1);
    }
}
