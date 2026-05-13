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
                price: 8000,
                maxValue: 0
            },
            {
                extra: "Double Glazing Windows",
                price: 3500,
                maxValue: 0
            },
            {
                extra: "Solar Panel Installation (Standard)",
                price: 15000,
                maxValue: 1
            },
            {
                extra: "Panic Room",
                price: 21000,
                maxValue: 2
            },
            {
                extra: "Fallout Shelter",
                price: 38000,
                maxValue: 1
            },
            {
                extra: "Wine Cellar",
                price: 15000,
                maxValue: 1
            }
        ]),
]);