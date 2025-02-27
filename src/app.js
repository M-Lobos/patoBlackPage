import express from 'express';
import { serverInitialization } from './services/server.init.js';

import { errorHandler } from './middlewares/errorHandler.js';
import router from './routes/routes.js';

const app = express()
const PORT = process.env.PORT || 4000
// Middleware to parse JSON request bodies  

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//importing routes
app.use('/api/v1', router)

//error handlers middleware
app.use(errorHandler);

//rissing and checking the server
serverInitialization(app, PORT);


