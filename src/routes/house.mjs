import express from 'express';
import { HouseController } from '../controllers/houseController.mjs';

const houseRoutes = express.Router();

houseRoutes.get("/list", HouseController.viewHouseList);
houseRoutes.get("/:houseId", HouseController.readHouse);
houseRoutes.post("/add", HouseController.createHouse);
houseRoutes.post("/update", HouseController.updateHouse);
houseRoutes.post("/delete/:houseId", HouseController.deleteHouse);
// no update yet

export default houseRoutes