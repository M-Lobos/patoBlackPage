import express from 'express';
import { serverInitialization } from './services/server.init.js';


const app = express()
const PORT = process.env.PORT || 4000
// Middleware to parse JSON request bodies  

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//rissing and checking the server
serverInitialization(app, PORT);
