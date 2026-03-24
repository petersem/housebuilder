// import { error } from "console";
import CompanyModel from "../models/CompanyModel.mjs"

import { logDanger, logWarning, logInfo } from "../utilities/logger.mjs";

/**
 * Manages all interractions for houses
 */
export class CompanyController {


    static viewCompanies(req, res) {

        const companies = CompanyModel.select();

        res.status(200);
        res.setHeader('Content-Type', 'application/json');
        res.json({ message: "records retrieved", data: companies });
    }

}