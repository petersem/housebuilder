import ShowcaseModel from "../models/ShowcaseModel.mjs"
import { matchedData, validationResult } from "express-validator"
import { logDanger, logWarning, logInfo } from "../utilities/logger.mjs";
import PricingModel from '../models/PricingModel.mjs';
import CompanyModel from '../models/CompanyModel.mjs';

/**
 * Manages all interractions for houses
 */
export class ShowcaseController {

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

        //res.redirect("/showcase/list");
    }

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