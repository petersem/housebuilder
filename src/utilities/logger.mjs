import { styleText } from 'node:util';
//import { errorMonitor } from 'node:events';
export const logError = styleText(['yellow', 'bgRed', 'bold'], 'Error!');
export const logWarning = styleText(['yellow', 'bgBlack', 'bold'], 'Warning');
export const logInfo = styleText(['white', 'bgBlue', 'bold'], 'Information');
