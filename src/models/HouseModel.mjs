import { DataModel } from "./DataModel.mjs";
import crypto from 'crypto';

export default class HouseModel extends DataModel {

    id;
    title;
    companyName;
    rooms;
    bathrooms;
    garages;
    floorAreaSqm;
    storyCount;
    totalCost;
    extras;

    constructor(title, companyName, rooms, bathrooms, garages, floorAreaSqm, storyCount, extras) {
        super();
        this.id = crypto.randomUUID;
        this.title = title;
        this.companyName = companyName;
        this.rooms = rooms;
        this.bathrooms = bathrooms;
        this.garages = garages;
        this.floorAreaSqm = floorAreaSqm;
        this.storyCount = storyCount;
        this.extras = extras;
    }

    static getHouse(id) {
        const result = this.select(house => house.id == id)
        return result;
    }
}

// Load static sample data. In the future we will use a database instead.
HouseModel.setDataSource([
    new HouseModel("Matt's House","DreamBuild Homes",5,2,1,300,1,["Built-in Wardrobe","Double Glazing Windows","Solar Panel Installation (Standard)"]),
    new HouseModel("Joe's House","DreamBuild Homes",5,2,1,400,1,["Built-in Wardrobe","Double Glazing Windows"]),
    new HouseModel("Lances's House","Value Builders",5,2,1,300,1,["Built-in Wardrobe"]),
    new HouseModel("Hannah's House","Premium Living Co.",7,2,2,800,2,["Built-in Wardrobe","Solar Panel Installation (Standard)"]),
    new HouseModel("Nicola's House","Value Builders",8,3,2,600,1,[]),
    new HouseModel("Dan's House","Premium Living Co.",5,2,1,300,1,["Built-in Wardrobe"]),
    new HouseModel("Laura's House","DreamBuild Homes",5,2,1,400,1,["Built-in Wardrobe","Double Glazing Windows"])
]);