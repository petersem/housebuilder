// import { error } from "console";
import PricingModel from "../models/PricingModel.mjs"

import { logDanger, logWarning, logInfo } from "../utilities/logger.mjs";

/**
 * Manages all interractions for houses
 */
export class PricingController {


    static readPrice(req, res) {

        const pricing = PricingModel.select();

        res.status(200);
        res.setHeader('Content-Type', 'application/json');
        res.json({ message: "records retrieved", data: pricing });
    }

}