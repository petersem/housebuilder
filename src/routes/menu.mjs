import express from "express";
import { MenuController } from "../controllers/MenuController.mjs";

export const menuRoutes = express.Router();

menuRoutes.get("/", MenuController.viewMenuPage);
menuRoutes.get("/products", MenuController.getProductsJSON);
menuRoutes.get("/products/:name", MenuController.viewProductDetailsPartial);


