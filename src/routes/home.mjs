import express from 'express';
import { HouseController } from '../controllers/HouseController.mjs';

let homeRoute = express.Router();

homeRoute.get("/", (req, res) => {
    res.render('home', { title: "House Builder" });
    }
);

export default homeRoute;