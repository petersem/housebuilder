import express from 'express';
import { CompanyController } from '../controllers/CompanyController.mjs';
import { query, body, param, checkSchema } from "express-validator"

const companyRoutes = express.Router();

/**
 * @swagger
 * /companies:
 *   get:
 *     summary: Get companies
 *     tags: [Companies]
 *     responses:
 *       200:
 *         description: Get all companies
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: "Value Builders"
 *                   basePrice:
 *                     type: integrer
 *                     example: 170000
 *                   rating:
 *                     type: integer
 *                     example: 4
 */
companyRoutes.get("/", CompanyController.viewCompanies);

export default companyRoutes