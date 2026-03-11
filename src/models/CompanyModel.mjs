import { DataModel } from "./DataModel.mjs";

export default class CompanyModel extends DataModel {

    name;
    basePrice;
    rating;

    constructor(name, basePrice, rating) {
        super();
        this.name = name;
        this.basePrice = basePrice;
        this.rating = rating;
    }

    static getCompany(name) {
        const result = this.select(company => company.name == name);
        return result;
    }
}

// Load static sample data. In the future we will use a database instead.
CompanyModel.setDataSource([
    new CompanyModel("DreamBuild Homes", 170000, 4.5),
    new CompanyModel("Value Builders", 150000, 4.0),
    new CompanyModel("Premium Living Co.", 200000, 4.8),
]);