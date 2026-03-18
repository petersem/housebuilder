import express from 'express';
import { HouseController } from '../controllers/HouseController.mjs';
import { query, body, param, checkSchema } from "express-validator"
import { addHouseValidationSchema, getHouseValidationSchema, updateHouseValidationSchema } from '../controllers/validators/houseSchema.mjs';


const houseRoutes = express.Router();

houseRoutes.get("/list", HouseController.viewHouseList);
houseRoutes.get("/:houseId", checkSchema(getHouseValidationSchema), HouseController.readHouse);
houseRoutes.post("/add", checkSchema(addHouseValidationSchema), HouseController.createHouse);
houseRoutes.put("/update",checkSchema(updateHouseValidationSchema), HouseController.updateHouse);
houseRoutes.delete("/delete", HouseController.deleteHouse);

export default houseRoutes