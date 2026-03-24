import express from 'express';
import { PricingController } from '../controllers/PricingController.mjs';
import { query, body, param, checkSchema } from "express-validator"


const pricingRoutes = express.Router();

pricingRoutes.get("/", PricingController.readPrice);

export default pricingRoutes