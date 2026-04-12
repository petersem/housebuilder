// import { error } from "console";
import PricingModel from "../models/PricingModel.mjs"

import { logDanger, logWarning, logInfo } from "../utilities/logger.mjs";

/**
 * Manages all interractions for pricing
 */
export class PricingController {

    /**
    * ### readPrice
    * Gets the global pricing data
    * @param {Express.Request} req 
    * @param {Express.Response} res 
    * @returns{JSON} An pricing array object
    */
    static readPrice(req, res) {

        const pricing = PricingModel.select();

        res.status(200);
        res.setHeader('Content-Type', 'application/json');
        res.json({ message: "records retrieved", data: pricing });
    }

}