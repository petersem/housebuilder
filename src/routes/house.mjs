import express from 'express';
import { HouseController } from '../controllers/HouseController.mjs';

const houseRoutes = express.Router();

houseRoutes.get("/list", HouseController.viewHouseList);
houseRoutes.get("/:houseId", HouseController.readHouse);
houseRoutes.post("/add", HouseController.createHouse);
houseRoutes.put("/update", HouseController.updateHouse);
houseRoutes.delete("/delete", HouseController.deleteHouse);

export default houseRoutes