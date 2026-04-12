import express from 'express';
import pkg from '../../package.json' with { type: 'json' };




let homeRoute = express.Router();

homeRoute.get("/", (req, res) => {
    res.render('home', { title: "House Builder", ver: pkg.version });
    }
);

export default homeRoute;