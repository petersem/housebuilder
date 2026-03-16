import { DataModel } from "./DataModel.mjs";

export default class PricingModel extends DataModel {

    perRoom;
    perBathroom;
    perGarage;
    perSqm;
    extras;

    constructor(perRoom, perBathroom, perGarage, perSqm, extras) {
        super();
        this.perRoom = perRoom;
        this.perBathroom = perBathroom;
        this.perGarage = perGarage;
        this.perSqm = perSqm;
        this.extras = extras;
    }

}

// Load static sample data. In the future we will use a database instead.
PricingModel.setDataSource([
    new PricingModel(18000, 12000, 15000, 1200,
        [
            {
                extra: "Built-in Wardrobe",
                price: 8000
            },
            {
                extra: "Double Glazing Windows",
                price: 3500
            },
            {
                extra: "Solar Panel Installation (Standard)",
                price: 15000
            }
        ]),
]);