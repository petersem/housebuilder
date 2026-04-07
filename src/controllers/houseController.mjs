// import { error } from "console";
import HouseModel from "../models/HouseModel.mjs"
import PricingModel from "../models/PricingModel.mjs";
import CompanyModel from "../models/CompanyModel.mjs";
import { matchedData, validationResult } from "express-validator"
import { logDanger, logWarning, logInfo } from "../utilities/logger.mjs";

/**
 * Manages all interractions for houses
 */
export class HouseController {

    /**
     * Checks for express-validator validation errors
     * @param {Request} req 
     * @param {Response} res 
     * @returns {JSON} an array of errors
     */
    static checkValidationErrors(req, res) {
        const result = validationResult(req);
        // if errors present
        if (!result.isEmpty()) {
            // format all the errors nicely
            let errors = [];
            result.array().forEach(err => {
                const error = {
                    "location": err.location,
                    "field": err.path,
                    "value": err.value,
                    "msg": err.msg,
                };
                errors.push(error);
                if (process.env.NODE_ENV === "development") {
                    console.log(logWarning, `Express-validator: ${error.field} - ${error.value} - ${error.msg}`);
                }                
            });
            return errors;
        }
        return;
    }

    // calculate total price for house
    /**
     * Calculates the total price for a house from selected options and company/pricing model data
     * @param {HouseModel} house 
     * @returns {int} The total price price for a given house and options
     */ 
    static costCalculator(house) {
        const pricing = PricingModel.select();

        let companyBasePrice = 0;
        let totalRoomPrice = 0;
        let totalBathroomPrice = 0;
        let totalGarargePrice = 0;
        let totalSqmPrice = 0;
        let totalExtrasPrice = 0;

        // get company base price
        companyBasePrice = CompanyModel.select(comp => comp.name == house.companyName)[0].basePrice;

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
        // validate fields and exit if errors
        const result = validationResult(req);
        const readErrs = HouseController.checkValidationErrors(req, res);
        if (readErrs?.length > 0) {
            return res.status(400).send({ errors: readErrs })
        }

        const errs = HouseController.checkValidationErrors(req, res);
        if (errs?.length > 0) {
            return res.status(400).send({ errors: errs })
        }

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
        // validate fields and exit if errors
        const result = validationResult(req);
        const readErrs = HouseController.checkValidationErrors(req, res);
        if (readErrs?.length > 0) {
            return res.status(400).send({ errors: readErrs })
        }

        // build extras array
        let extras = [];
        if (req.body.builtIns == "on") { extras.push("Built-in Wardrobe") };
        if (req.body.doubleGlazing == "on") { extras.push("Double Glazing Windows") };
        if (req.body.solarPanel == "on") { extras.push("Solar Panel Installation (Standard)") };

        // build new house object
        const updatedHouse = new HouseModel(
            req.body.id,
            req.body.title,
            req.body.companyName,
            req.body.rooms,
            req.body.bathrooms,
            req.body.garages,
            req.body.floorAreaSqm,
            req.body.storyCount,
            req.body.extras = extras
        )

        // recalculate price
        updatedHouse.totalCost = HouseController.costCalculator(updatedHouse);

        // update house
        const outcome = HouseModel.update(house => house.id == req.body.id, updatedHouse);
        res.setHeader('Content-Type', 'application/json');

        // if deleted or not found
        if (outcome != 0) {
            // updated
            res.json({ message: "record updated", data: updatedHouse });
            res.status(201);
        } else {
            // was not present
            res.setHeader('Content-Type', 'application/json');
            res.status(204).json({ message: "record not found" });
        }
        res.end();

        //res.redirect("/house/list");
    }

    static createHouse(req, res) {
        // validate fields and exit if errors
        const result = validationResult(req);
        const addErrs = HouseController.checkValidationErrors(req, res);
        if (addErrs?.length > 0) {
            return res.status(400).send({ errors: addErrs })
        }

        // perform create operation
        const id = req.body?.id;
        const title = req.body?.title;
        const companyName = req.body?.companyName;
        const rooms = req.body?.rooms;
        const bathrooms = req.body?.bathrooms;
        const garages = req.body?.garages;
        const floorAreaSqm = req.body?.floorAreaSqm;
        const storyCount = req.body?.storyCount;
        const extras = req.body?.extras;

        const house = new HouseModel(id, title, companyName, rooms, bathrooms, garages, floorAreaSqm, storyCount, extras);

        res.setHeader('Content-Type', 'application/json');

        try {
            res.status(201);
            HouseModel.insert(house);
            res.json({ message: "record added", data: house });
        }
        catch (err) {
            res.status(400);
            res.json({ message: "bad request", data: err.message })
            throw err;
        } finally {
            res.end();
        }
    }

    static deleteHouse(req, res) {
        const outcome = HouseModel.delete(house => house.id == req.body.houseId);

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