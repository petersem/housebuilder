import ShowcaseModel from "../models/ShowcaseModel.mjs"
import { matchedData, validationResult } from "express-validator"
import { logDanger, logWarning, logInfo } from "../utilities/logger.mjs";
import PricingModel from '../models/PricingModel.mjs';
import CompanyModel from '../models/CompanyModel.mjs';

/**
 * Manages all interractions for showcase houses
 */
export class ShowcaseController {

    /**
     * ### checkValidationErrors
     * Checks for express-validator validation errors
     * @param {Express.Request} req The request object
     * @param {Express.Response} res  The response object
     * @returns {JSON} [error] an array of errors
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

    /**
     * 
     * @param {house} house a showcase house
     * @returns {Number} The total price for the house
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

    /**
     * ### viewShowcase
     * Retrieves all showcase houses
     * @param {Express.Request} req The express request object
     * @param {Express.Reponse} res The express response object
     * @returns {Array} An array of house objects
     */
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

    /**
     * ### readHouse
     * Retrieves an individual showcase house
     * @param {Express.Request} req The express request object
     * @param {Express.Reponse} res The express response object
     * @returns {json} house A showcase house
     */
    static readHouse(req, res) {
        // validate fields and exit if errors
        const result = validationResult(req);
        const readErrs = ShowcaseController.checkValidationErrors(req, res);
        if (readErrs?.length > 0) {
            return res.status(400).send({ errors: readErrs })
        }

        const errs = ShowcaseController.checkValidationErrors(req, res);
        if (errs?.length > 0) {
            return res.status(400).send({ errors: errs })
        }

        const pricing = PricingModel.select();
        const companies = CompanyModel.select();
        const house = ShowcaseModel.select(house => house.id == req.params.houseId);
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

    /**
     * ### updateHouse
     * Updates an individual showcase house
     * @param {Express.Request} req The express request object
     * @param {Express.Reponse} res The express response object
     */
    static updateHouse(req, res) {
        // validate fields and exit if errors
        const result = validationResult(req);
        const readErrs = ShowcaseController.checkValidationErrors(req, res);
        if (readErrs?.length > 0) {
            return res.status(400).send({ errors: readErrs })
        }

        // build new house object
        const updatedHouse = new ShowcaseModel(
            req.body.id,
            req.body.title,
            req.body.companyName,
            req.body.rooms,
            req.body.bathrooms,
            req.body.garages,
            req.body.floorAreaSqm,
            req.body.storyCount,
            req.body.totalCost,
            req.body.extras
        )

        // update house
        const outcome = ShowcaseModel.update(house => house.id == req.body.id, updatedHouse);
        res.setHeader('Content-Type', 'application/json');

        // if deleted or not found
        if (outcome != 0) {
            // updated
            res.status(201).json({ message: "record updated", data: updatedHouse });
        } else {
            // was not present
            res.setHeader('Content-Type', 'application/json');
            res.status(204).json({ message: "record not found" });
        }
        res.end();
    }

    /**
     * Creates a showcase house
     * @param {Request} req request object
     * @param {Response} res response object 
     */
    static createHouse(req, res) {

        // validate fields and exit if errors
        const result = validationResult(req);
        const readErrs = ShowcaseController.checkValidationErrors(req, res);
        if (readErrs?.length > 0) {
            return res.status(400).send({ errors: readErrs })
        }

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
        res.setHeader('Content-Type', 'application/json');

        try {
            res.status(201);
            ShowcaseModel.insert(house);
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

    /**
     * Deletes a showcase house
     * @param {Request} req 
     * @param {Response} res 
     */
    static deleteHouse(req, res) {
        const outcome = ShowcaseModel.delete(house => house.id == req.body.houseId);

        // if deleted or not found
        if (outcome != 0) {
            // no json response of content type allowed with a 204
            res.status(204);
        } else {
            res.setHeader('Content-Type', 'application/json');
            res.status(404).json({ message: "record not found" });
        }
        res.end();
    }
}