import express from 'express';
import { PricingController } from '../controllers/PricingController.mjs';
import { query, body, param, checkSchema } from "express-validator"


const pricingRoutes = express.Router();

/**
 * @swagger
 * /pricing:
 *   get:
 *     summary: Get pricing
 *     tags: [Pricing]
 *     responses:
 *       200:
 *         description: Get all pricing
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   perRoom:
 *                     type: integer
 *                     example: 18000
 *                   perBathroom:
 *                     type: integrer
 *                     example: 12000
 *                   perGarage:
 *                     type: integer
 *                     example: 15000
 *                   perSqm:
 *                     type: integer
 *                     example: 1200
 *                   extras:
 *                     type: array
 *                     example: [{extra: "Built-in Wardrobe", price: 8000}, {extra: "Double Glazing Windows", price: 3500}]
 */
pricingRoutes.get("/", PricingController.readPrice);

export default pricingRoutes