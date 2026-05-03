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

    constructor(id, title, companyName, rooms, bathrooms, garages, floorAreaSqm, storyCount, totalCost, extras=[]) {
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

ShowcaseModel.setDataSource([
    new ShowcaseModel("46ac80a9-3ea6-4481-b903-8b304764bc15", "Matt's Weird Place","Premium Living Co.",15,2,1,800,27,1605550,["Built-in Wardrobe","Double Glazing Windows","Solar Panel Installation (Standard)"]),
    new ShowcaseModel("46ac8019-3ea6-4481-b903-8b304764bc15", "Joe's House","DreamBuild Homes",5,1,1,400,1,500550,["Built-in Wardrobe","Double Glazing Windows"]),
    new ShowcaseModel("46ac80a9-3ea6-4482-b903-8b304764bc15", "Hannah's Joint","Value Builders",7,2,2,800,2,1200500,["Built-in Wardrobe","Double Glazing Windows","Solar Panel Installation (Standard)"]),
    new ShowcaseModel("46ac81a9-3ea6-4481-b903-8b304764bc15", "Lances's House","Value Builders",15,2,1,300,1,1400500,["Solar Panel Installation (Standard)"]),
    new ShowcaseModel("46ac80a9-3ea6-4481-b903-8b304764bc45", "Nicola's House","Value Builders",8,3,2,600,1,700500),
    new ShowcaseModel("46ac80a9-3ea6-4481-b963-8b304764bc17", "Dan's House","Premium Living Co.",9,2,2,300,1,8000500,["Built-in Wardrobe"]),
    new ShowcaseModel("46ac80a9-3ea6-4488-b903-8b304764bc15", "Laura's House","DreamBuild Homes",5,1,1,600,1,1450500,["Built-in Wardrobe","Double Glazing Windows"])
]);

// ShowcaseModel.setDataSource([]);