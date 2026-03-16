import { DataModel } from "./DataModel.mjs";
import crypto from 'crypto';

export default class ShowcaseModel extends DataModel {

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

    constructor(id, title, companyName, rooms, bathrooms, garages, floorAreaSqm, storyCount, totalCost, extras) {
        super();
        this.id = id;
        this.title = title;
        this.companyName = companyName;
        this.rooms = rooms;
        this.bathrooms = bathrooms;
        this.garages = garages;
        this.floorAreaSqm = floorAreaSqm;
        this.storyCount = storyCount;
        this.totalCost = totalCost;
        this.extras = extras;
    }
}

// Load static sample data. In the future we will use a database instead. null is first param for new house records
// HouseModel.setDataSource([
//     new HouseModel(null, "Matt's House","DreamBuild Homes",5,2,1,300,1,["Built-in Wardrobe","Double Glazing Windows","Solar Panel Installation (Standard)"]),
//     new HouseModel(null, "Joe's House","DreamBuild Homes",5,2,1,400,1,["Built-in Wardrobe","Double Glazing Windows"]),
//     new HouseModel(null, "Lances's House","Value Builders",5,2,1,300,1,["Built-in Wardrobe"]),
//     new HouseModel(null, "Hannah's House","Premium Living Co.",7,2,2,800,2,["Built-in Wardrobe","Solar Panel Installation (Standard)"]),
//     new HouseModel(null, "Nicola's House","Value Builders",8,3,2,600,1,null),
//     new HouseModel(null, "Dan's House","Premium Living Co.",5,2,1,300,1,["Built-in Wardrobe"]),
//     new HouseModel(null, "Laura's House","DreamBuild Homes",5,2,1,400,1,["Built-in Wardrobe","Double Glazing Windows"])
// ]);

ShowcaseModel.setDataSource([]);