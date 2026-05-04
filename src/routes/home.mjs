import express from 'express';
import pkg from '../../package.json' with { type: 'json' };

export const homeRoute = express.Router();

homeRoute.get("/", (req, res) => {
    res.render('home', { title: "House Builder", ver: pkg.version });
    }
);

homeRoute.get("/about", (req, res) => {
    res.render('about', { title: "About House Builder", ver: pkg.version });
    }
);

