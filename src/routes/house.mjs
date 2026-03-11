import express from 'express';
import { HouseController } from '../controllers/houseController.mjs';

const houseRoutes = express.Router();

houseRoutes.get("/list", HouseController.viewHouseList);
houseRoutes.get("/list/:houseId", HouseController.viewHouse);
houseRoutes.post("/add", HouseController.addHouse);
houseRoutes.post("/delete", HouseController.deleteHouse);
// no update yet

export default houseRoutes