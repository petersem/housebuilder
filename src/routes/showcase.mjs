import express from 'express';
import { ShowcaseController } from '../controllers/showcaseController.mjs';
import { query, body, param, checkSchema } from "express-validator"
import { addShowcaseValidationSchema } from '../controllers/validators/showcaseSchema.mjs';

const showcaseRoutes = express.Router();

showcaseRoutes.get("/list", ShowcaseController.viewShowcase);
showcaseRoutes.post("/add", checkSchema(addShowcaseValidationSchema), ShowcaseController.createHouse);
showcaseRoutes.delete("/delete", ShowcaseController.deleteHouse);

export default showcaseRoutes