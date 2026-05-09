import express from 'express';
import pkg from '../../package.json' with { type: 'json' };

export const houseBuilderRoutes = express.Router();

houseBuilderRoutes.get("/", (req, res) => {
    res.render('houselist.ejs', { title: "House List", ver: pkg.version });
    });

houseBuilderRoutes.get("/create", (req, res) => {
    res.render('housedetails.ejs', { title: "House Builder New", ver: pkg.version });
    });

houseBuilderRoutes.get("/:houseID", (req, res) => {
    res.render('housedetails.ejs', { title: "House Builder Edit", ver: pkg.version });
    });


