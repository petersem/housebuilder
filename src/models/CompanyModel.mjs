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
}

// Load static sample data. In the future we will use a database instead.
CompanyModel.setDataSource([
    new CompanyModel("DreamBuild Homes", 170000, 3.8),
    new CompanyModel("Value Builders", 150000, 2.6),
    new CompanyModel("Premium Living Co.", 200000, 4.8),
]);