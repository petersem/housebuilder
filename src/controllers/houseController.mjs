// import { error } from "console";
import HouseModel from "../models/HouseModel.mjs"
import PricingModel from "../models/PricingModel.mjs";
import CompanyModel from "../models/CompanyModel.mjs";

/**
 * Manages all interractions for houses
 */
export class HouseController {

    // calculate total price for house
    /**
     * Calculates the total price for a house from selected options and company/pricing model data
     * @param {HouseModel} house 
     * @returns The total price price for a given house and options
     */ void
    static costCalculator(house) {
        const pricing = PricingModel.select();
        const companies = CompanyModel.select();

        let companyBasePrice = 0;
        let totalRoomPrice = 0;
        let totalBathroomPrice = 0;
        let totalGarargePrice = 0;
        let totalSqmPrice = 0;
        let totalExtrasPrice = 0;

        // get company base price
        companyBasePrice = CompanyModel.getCompany(house.companyName)[0].basePrice

        // calculate other costs
        totalRoomPrice = house.rooms * pricing[0].perRoom;
        totalBathroomPrice = house.rooms * pricing[0].perBathroom;
        totalGarargePrice = house.garages * pricing[0].perGarage;
        totalSqmPrice = house.floorAreaSqm * pricing[0].perSqm;

        // calculate any extras
        house.extras.forEach(extra => {
            totalExtrasPrice += [pricing[0].extras.find((ex) => ex.extra == extra)][0].price;
        });

        // return total cost
        return (companyBasePrice + totalRoomPrice + totalBathroomPrice + totalGarargePrice + totalSqmPrice + totalExtrasPrice);
    }

    static viewHouseList(req, res) {
        let houses = HouseModel.select();
        houses.forEach(house => {
            // calculate current total price if null
            house.totalCost = house.totalCost ?? HouseController.costCalculator(house)
        });

        // res.status(200);
        // res.setHeader('Content-Type', 'application/json');
        // res.json({ message: "records retrieved", data: houses });

        res.status(200);
        res.render('houselist', {
            title: "House Builder",
            data: houses
        });
    }

    static readHouse(req, res) {
        const pricing = PricingModel.select();
        const companies = CompanyModel.select();
        const house = HouseModel.select(house => house.id == req.params.houseId);
        // check if house record found
        if (house.length == 0) {
            res.status(404);
            res.setHeader('Content-Type', 'application/json');
            res.json({ message: "record not found", data: req.params.houseId });
        } else {
            res.status(200);
            res.setHeader('Content-Type', 'application/json');
            res.json({ message: "record retrieved", data: house });

            // Render details page
            // res.status(200);
            // res.render('housedetails', {
            // title: "House Details",
            // data: [house, companies, pricing]
            // });
        }
    }

    static updateHouse(req, res) {
        let extras = [];
        if (req.body.builtIns == "on") { extras.push("Built-in Wardrobe")};
        if (req.body.doubleGlazing == "on") { extras.push("Double Glazing Windows")};
        if (req.body.solarPanel == "on") { extras.push("Solar Panel Installation (Standard)")};

        const updatedHouse = new HouseModel(
            req.body.id,
            req.body.title,
            req.body.companyName,
            req.body.rooms,
            req.body.bathrooms,
            req.body.garages,
            req.body.floorAreaSqm,
            req.body.storyCount,
            extras
        )

        updatedHouse.totalCost = HouseController.costCalculator(updatedHouse);

        HouseModel.update(house => house.id == req.body.id, updatedHouse);

        res.status(201)
        res.redirect("/house/list");
    }

    static createHouse(req, res) {
        const title = req.body?.title;
        const companyName = req.body?.companyName;
        const rooms = req.body?.rooms;
        const bathrooms = req.body?.bathrooms;
        const garages = req.body?.garages;
        const floorAreaSqm = req.body?.floorAreaSqm;
        const storyCount = req.body?.storyCount
        
        try {
            HouseModel.insert(new HouseModel(null, title, companyName, rooms, bathrooms, garages, floorAreaSqm, storyCount, ["Built-in Wardrobe","Double Glazing Windows","Solar Panel Installation (Standard)"]));
        }
        catch (err) {
            throw err;
        }

        res.status(201);
        res.setHeader('Content-Type', 'application/json');
        res.json({ message: "record added", data: req.body });
        // res.render('viewEditHouse', {
        //     title: "New House Details",
        //     data: pricing, companies
        // });
    }

    static deleteHouse(req, res) {
        console.log("Deleted:", req.params.houseId);
        HouseModel.delete(house => house.id == req.params.houseId);
        res.status(204).json({ message: req.params.houseId + " deleted" });
        res.end();
        //res.redirect("/house/list");
    }
}