import { logError, logWarning, logInfo } from "../utilities/logger.mjs";

/**
 import { logError, logWarning, logInfo } from "../utilities/logger.mjs";* Middleware to handle error stackstraces if in dev or prod
 * @param {*} err 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
export const errorMiddleware = function () {
    if (process.env?.NODE_ENV === "development") {
        console.log(logInfo, `Error Middleware: Activated`);
    }
    return (err, req, res, next) => {
        if (process.env?.NODE_ENV === "development") {
            console.log(logError, err);
        } else {
            console.log(logError, err.message);
        }
        const statusCode = res.statusCode ? res.statusCode : 500;
        res.status(statusCode);
        res.json({message: err.message, stack: process.env.NODE_ENV === "development" ? err.stack : null});
    }
}