// import { error } from "console";
import HouseModel from "../models/HouseModel.mjs"
import PricingModel from "../models/PricingModel.mjs";
import CompanyModel from "../models/CompanyModel.mjs";

export class HouseController {

    static costCalculator(house) {
        let pricing = PricingModel.select();
        let companies = CompanyModel.select();

        let companyBasePrice = 0;
        let totalRoomPrice = 0;
        let totalBathroomPrice = 0;
        let totalGarargePrice = 0;
        let totalSqmPrice = 0;
        let totalExtrasPrice = 0;

        // get company base price
        companyBasePrice = CompanyModel.getCompany(house.companyName)[0].basePrice

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

    static viewHouseList(req, res) {
                // throw new Error("Blah!!!!!");
        let houses = HouseModel.select();
        houses.forEach(house => {
            // calculate current total price
            house.totalCost = HouseController.costCalculator(house);
        });

        res.status(200);
        res.render('houselist', {
            title: "House Builder",
            data: houses
        });
    }

    static editHouse(req, res) {
        let houses = HouseModel.select();
        houses.forEach(house => {
            // calculate current total price
            house.totalPrice = this.costCalculator(house);
        });
        res.status(200);
        res.render('viewEditHouse', {
            title: "Edit House",
            data: houses, pricing, companies
        });
    }

    static viewHouse(req, res) {
        let houses = HouseModel.select();
        houses.forEach(house => {
            // calculate current total price
            house.totalPrice = this.costCalculator(house);
        });
        res.status(200);
        res.render('tasks', {
            title: "Yoda's House List",
            data: houses
        });
    }

    static addHouse(req, res) {
        HouseModel.insert(new HouseModel(req.body.textNewTask, false));
        res.status(201);
        res.redirect("/house/list");
    }

    static deleteHouse(req, res) {
        // split out uuid properties from object and put into an array we can work with.
        // just in case we have any records loaded in that were completed
        let keyArray = Object.keys(req.body).map(function(key) {
            return [key, req.body[key]];
        })

        keyArray.forEach(id => {
            HouseModel.delete((task) => task.id == id[0] );
        });
        res.status(204);
        res.redirect("/house/list");
    }
}