import express from 'express';
import path from 'path';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import helmet from 'helmet';
import { sanitiser, errorMiddleware, idempotencyMiddleware, devOptions, limiterOptions, rateLimit, corsOptions, swaggerSpec, fileURLToPath } from './middleware/middlewareLoader.mjs';
import { homeRoute, companyRoutes, pricingRoutes, showcaseRoutes } from './routes/routesLoader.mjs';
import { logDanger, logWarning, logInfo } from "./utilities/logger.mjs";

// Load environment values to variables
const PORT = process.env.PORT || 3000;
console.log(logInfo, `Environment: ${process.env?.NODE_ENV}`);

// setup express
const app = express();  // setup express app
app.set("view engine", "ejs");  // use ejs for the view engine
app.set("views", path.join(import.meta.dirname, "/views")); // define where the views are
// setup basic express middleware
app.use(express.json());  // handle json payloads that come in
app.use(express.urlencoded({ extended: true }));  // handle querystring nested data inputs
app.use(express.static(path.join(import.meta.dirname, "public"))); // handle any static images, stylesheets, etc.


// implement express rate limiter
const limiter = rateLimit(limiterOptions)
app.use(limiter) // Apply the rate limiting middleware to all requests.
console.log(logInfo, `Express-rate-limiter enabled. 
                - Requests: ${limiterOptions.limit} 
                - Period: ${limiterOptions.windowMs / 1000 / 60} minutes`);

// add helmet middleware
app.use(helmet());
console.log(logInfo, `Helmet enabled`);

// add cors support
app.use(cors(corsOptions));
console.log(logInfo, `Cors enabled, and allowing: ${corsOptions.origin}`);



// add swagger docs
const __filename = fileURLToPath(import.meta.url);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
console.log(logInfo, `Swagger enabled on /api-docs`);

// must run before before routes and idemponcyMiddleware
app.use(sanitiser("reject")); // sanitises req.body prop values - Options are 'clean' (default), 'warn', 'fail', or 'disable'

// must run before routes
app.use(idempotencyMiddleware(devOptions)); // adds idempotence functionality for post, put, and patch - (flushes tokens as required)

// add top-level routes
app.use("/", homeRoute);
app.use("/showcase", showcaseRoutes);
app.use("/pricing", pricingRoutes);
app.use("/companies", companyRoutes);
app.use("/err", (req, res) => {
    throw new Error('Ooff! What an error!') // just here for testing errorMiddleware
});

// must run last thing
app.use(errorMiddleware()); // manage display via middleware

// start listening on a specified port 
app.listen(PORT, () => {
    console.log(logInfo, `Express app: Listening on port ${PORT}`)
});
