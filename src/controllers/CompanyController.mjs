// import { error } from "console";
import CompanyModel from "../models/CompanyModel.mjs"

import { logDanger, logWarning, logInfo } from "../utilities/logger.mjs";

/**
 * Manages all interractions for companies
 */
export class CompanyController {

    /**
     * viewCompanies gets all companies from the CompanyModel
     * @param {Object} - The request 
     * @param {Object} - The response 
     * @return {companies[]} array of companies
     */
    static viewCompanies(req, res) {
        const companies = CompanyModel.select();

        res.status(200);
        res.setHeader('Content-Type', 'application/json');
        res.json({ message: "records retrieved", data: companies });
    }

}