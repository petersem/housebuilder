
//import { Request, Response, next } from 'express';
import crypto from 'crypto';
import { InMemoryIdempotencyStore } from './InMemoryIdempotencyStore.mjs';

const idemStore = new InMemoryIdempotencyStore();

const defaultOptions = {
  headerName: 'Idempotency-Key',
  requiredForMethods: ['POST', 'PUT', 'PATCH'],
  ttlMs: 24 * 60 * 60 * 1000,
};

// Hash the request body to detect key reuse with different payloads
function hashRequest(body) {
  const content = JSON.stringify(body) || '';
  return crypto.createHash('sha256').update(content).digest('hex');
}

export function idempotencyMiddleware(options = {}) {
  const config = { ...defaultOptions, ...options };

  return async (req, res, next) => {
    // Skip methods that do not need idempotency
    if (!config.requiredForMethods?.includes(req.method)) {
      return next();
    }

    const idempotencyKey = req.headers[config.headerName?.toLowerCase()];

    // Require idempotency key for protected methods
    if (!idempotencyKey) {
      return res.status(400).json({
        error: 'Missing idempotency key',
        message: `The ${config.headerName} header is required for ${req.method} requests`,
      });
    }

    // Validate key format (UUID recommended)
    if (!/^[a-zA-Z0-9-_]{16,64}$/.test(idempotencyKey)) {
      return res.status(400).json({
        error: 'Invalid idempotency key format',
        message: 'Key must be 16-64 alphanumeric characters, hyphens, or underscores',
      });
    }

    // Create a composite key including the endpoint
    const compositeKey = `${req.method}:${req.path}:${idempotencyKey}`;
    const requestHash = hashRequest(req.body);

    // Check for existing record
    const existing = idemStore.get(compositeKey);

    if (existing) {
      // Verify request body matches (detect key reuse with different payload)
      if (existing.requestHash !== requestHash) {
        return res.status(422).json({
          error: 'Idempotency key reused with different request',
          message: 'Each unique request must use a unique idempotency key',
        });
      }

      // Request is still processing
      if (existing.status === 'processing') {
        return res.status(409).json({
          error: 'Request in progress',
          message: 'A request with this idempotency key is currently being processed',
        });
      }

      // Return cached response
      if (existing.response) {
        // Set headers to indicate cached response
        res.set('Idempotent-Replayed', 'true');

        for (const [key, value] of Object.entries(existing.response.headers)) {
          res.set(key, value);
        }

        return res.status(existing.response.statusCode).json(existing.response.body);
      }
    }

    // Mark request as processing
    idemStore.set(compositeKey, {
      status: 'processing',
      requestHash,
      createdAt: new Date(),
    });

    // Store original response methods
    const originalJson = res.json.bind(res);
    const originalSend = res.send.bind(res);

    // Intercept response to cache it
    const captureResponse = (body) => {
      const record = idemStore.get(compositeKey);

      if (record && record.status === 'processing') {
        // Determine if successful based on status code
        const isSuccess = res.statusCode >= 200 && res.statusCode < 300;

        idemStore.set(compositeKey, {
          ...record,
          status: isSuccess ? 'completed' : 'failed',
          response: {
            statusCode: res.statusCode,
            body,
            headers: {
              'Content-Type': res.get('Content-Type') || 'application/json',
            },
          },
          completedAt: new Date(),
        });
      }

      return body;
    };

    // Override response methods
    res.json = (body) => {
      captureResponse(body);
      return originalJson(body);
    };

    res.send = (body) => {
      if (typeof body === 'object') {
        captureResponse(body);
      }
      return originalSend(body);
    };

    // Handle errors - clear processing state
    res.on('error', () => {
      idemStore.delete(compositeKey);
    });

    next();
  };
}