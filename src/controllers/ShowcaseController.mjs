// import { error } from "console";
import ShowcaseModel from "../models/ShowcaseModel.mjs"

/**
 * Manages all interractions for houses
 */
export class ShowcaseController {
    static viewShowcase(req, res) {
        let houses = ShowcaseModel.select();

        res.status(200);
        res.setHeader('Content-Type', 'application/json');
        res.json({ message: "records retrieved", data: houses });

        // res.status(200);
        // res.render('showcaselist', {
        //     title: "Showcase",
        //     data: houses
        // });
    }

    static createHouse(req, res) {
        
        const id = req.body.id;
        const title = req.body.title;
        const companyName = req.body.companyName;
        const rooms = req.body.rooms;
        const bathrooms = req.body.bathrooms;
        const garages = req.body.garages;
        const floorAreaSqm = req.body.floorAreaSqm;
        const storyCount = req.body.storyCount;
        const totalCost = req.body.totalCost;
        const extras = req.body.extras;
        
        const house = new ShowcaseModel(id, title, companyName, rooms, bathrooms, garages, floorAreaSqm, storyCount, totalCost, extras);
        //console.log(house);


        res.setHeader('Content-Type', 'application/json');

        try {
            res.status(201);
            ShowcaseModel.insert(house);
            res.json({ message: "record added", data: house });
        }
        catch (err) {
            res.status(400);
            res.json({ message: "bad request", data: err.message})
            throw err;
        } finally {
            res.end();
        }
    }

    static deleteHouse(req, res) {
        const outcome = ShowcaseModel.delete(house => house.id == req.body.houseId);

        // if deleted or not found
        if (outcome != 0) {
            // no json response allowed with a 204
            res.status(204);
        } else {
            res.setHeader('Content-Type', 'application/json');
            res.status(404).json({ message: "record not found" });
        }
        res.end();

        //res.redirect("/house/list");
    }
}