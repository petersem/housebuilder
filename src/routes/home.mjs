import express from 'express';

let homeRoute = express.Router();

homeRoute.get("/", (req, res) => {
    res.render('home', { title: "House Builder" });
    }
);

export default homeRoute;