import express from 'express';
import path from 'path';
import homeRoute from './routes/home.mjs';
import showcaseRoutes from './routes/showcase.mjs';
import { sanitiser } from './middleware/sanitiser.mjs';
import { errorMiddleware } from './middleware/errorMiddleware.mjs';
import { idempotencyMiddleware } from './middleware/idempotency.mjs';
import { logDanger, logWarning, logInfo } from "./utilities/logger.mjs";
import companyRoutes from './routes/companies.mjs';
import pricingRoutes from './routes/pricing.mjs';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swagger.config.mjs';
import { fileURLToPath } from "url";
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit'

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
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	ipv6Subnet: 56, // Set to 60 or 64 to be less aggressive, or 52 or 48 to be more aggressive
	// store: ... , // Redis, Memcached, etc. See below.
})

// Apply the rate limiting middleware to all requests.
app.use(limiter)
console.log(logInfo, `Express-rate-limiter enabled`);

// add cors support
var corsOptions = {
  origin: [`http://127.0.0.1:${PORT}`, `http://localhost:${PORT}`]
}
app.use(cors(corsOptions));
console.log(logInfo, `Cors enabled, and allowing: ${corsOptions.origin[1]}`);

// add helmet middleware
app.use(helmet());
console.log(logInfo, `Helmet enabled`);

// add swagger docs
const __filename = fileURLToPath(import.meta.url);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
console.log(logInfo, `Swagger enabled on /api-docs`);

// must run before before routes and idemponcyMiddleware
app.use(sanitiser("reject")); // sanitises req.body prop values - Options are 'clean' (default), 'warn', 'fail', or 'disable'

// must run before routes
let devOptions;
if (process.env?.NODE_ENV === "development") {
    devOptions = { ttlMs: 3 * 60 * 1000, cleanupIntervalM: 1 }
}
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
