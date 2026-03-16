import express from 'express';
import { ShowcaseController } from '../controllers/showcaseController.mjs';

const showcaseRoutes = express.Router();

showcaseRoutes.get("/list", ShowcaseController.viewShowcase);
showcaseRoutes.post("/add", ShowcaseController.createHouse);
showcaseRoutes.delete("/delete", ShowcaseController.deleteHouse);

export default showcaseRoutes