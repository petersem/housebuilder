import express from 'express';
import path from 'path';
import houseRoutes from './routes/house.mjs';
import homeRoute from './routes/home.mjs';
import showcaseRoutes from './routes/showcase.mjs';
import { sanitiser } from './middleware/sanitiser.mjs';
import { errorMiddleware } from './middleware/errorMiddleware.mjs';
import { idempotencyMiddleware } from './middleware/idempotency.mjs';

// Load environment values to variables
const PORT = process.env.PORT || 3000;
console.log(`Mode: ${process.env.NODE_ENV}`);

const app = express();  // setup express app

app.set("view engine", "ejs");  // use ejs for the view engine
app.set("views", path.join(import.meta.dirname, "/views")); // define where the views are

// setup basic express middleware
app.use(express.json());  // handle json payloads that come in
app.use(express.urlencoded({ extended: true }));  // handle querystring nested data inputs
app.use(express.static(path.join(import.meta.dirname, "public"))); // handle any static images, stylesheets, etc.

// must run before before routes and idemponcyMiddleware
app.use(sanitiser("reject")); // sanitises req.body prop values - Options are 'clean' (default), 'warn', 'fail', or 'disable'
// must run before routes
app.use(idempotencyMiddleware({ ttlMs: 2 * 60 * 1000, cleanupIntervalM: 1 })); // adds idempotence functionality for post, put, and patch - (flushes tokens every 5 minutes)

// add top-level routes
app.use("/", homeRoute);
app.use("/house", houseRoutes);
app.use("/showcase", showcaseRoutes);
app.use("/err", (req, res) => {
    throw new Error('Ooff! What an error!') // just here for testing
});

// must run last thing
app.use(errorMiddleware); // manage display via middleware

// start listening on a specified port 
app.listen(PORT, () => {
    console.log(`Express app listening on port ${PORT}`)
});
