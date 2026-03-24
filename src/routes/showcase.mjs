import express from 'express';
import { ShowcaseController } from '../controllers/ShowcaseController.mjs';
import { query, body, param, checkSchema } from "express-validator"
import { addShowcaseValidationSchema, updateShowcaseValidationSchema, getShowcaseValidationSchema} from '../controllers/validators/showcaseSchema.mjs';

const showcaseRoutes = express.Router();

showcaseRoutes.get("/list", ShowcaseController.viewShowcase);
showcaseRoutes.post("/add", checkSchema(addShowcaseValidationSchema), ShowcaseController.createHouse);
showcaseRoutes.delete("/delete", ShowcaseController.deleteHouse);
showcaseRoutes.put("/update",checkSchema(updateShowcaseValidationSchema), ShowcaseController.updateHouse);
showcaseRoutes.get("/:houseId", checkSchema(getShowcaseValidationSchema), ShowcaseController.readHouse);

export default showcaseRoutes