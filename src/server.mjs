import express from 'express';
import path from 'path';
import houseRoutes from './routes/house.mjs';
import homeRoute from './routes/home.mjs';
import { sanitiser } from './middleware/sanitiser.mjs';
import { errorMiddleware } from './middleware/errorMiddleware.mjs';
import { idempotencyMiddleware } from './middleware/idempotency.mjs';

import crypto from 'crypto'; // for testing
console.log(crypto.randomUUID());

// Load environment values to variables
const PORT = process.env.PORT || 3000;

console.log(`Mode: ${process.env.NODE_ENV}`);

const app = express();  // setup express app

app.set("view engine", "ejs");  // use ejs for the view engine
app.set("views", path.join(import.meta.dirname, "/views")); // define where the views are

app.use(express.json());  // handle json payloads that come in
app.use(express.urlencoded({ extended: true }));  // handle querystring nested data inputs
app.use(express.static(path.join(import.meta.dirname, "public"))); // handle any static images, stylesheets, etc.
app.use(sanitiser("fail")); // sanitises req.body prop values - Options are 'clean' (default), 'warn', 'fail', or 'disable'
app.use(idempotencyMiddleware()); // adds idempotence functionality for post, put, and patch

// add top-level routes
app.use("/", homeRoute);
app.use("/house", houseRoutes);
app.use("/err", (req, res) => {
    throw new Error('Ooff! What an error!') // just here for testing
});

app.use(errorMiddleware); // lastly, manage display via middleware

// start listening on a specified port 
app.listen(PORT, () => {
    console.log(`Express app listening on port ${PORT}`)
});
