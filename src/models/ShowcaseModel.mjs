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
    new ShowcaseModel("46ac8019-3ea6-4481-b903-8b304764bc15", "Joe's Joint","DreamBuild Homes",5,1,1,400,1,500550,["Built-in Wardrobe","Solar Panel Installation (Standard)"]),
    new ShowcaseModel("46ac80a9-3ea6-4482-b903-8b304764bc15", "Hannah's Haven","Premium Living Co.",7,2,2,800,2,1200500,["Built-in Wardrobe","Double Glazing Windows","Solar Panel Installation (Standard)"]),
    new ShowcaseModel("46ac80a9-3ea6-4488-b903-8b304764bc15", "Lance's Lair","Value Builders",5,1,1,600,1,1450500,["Built-in Wardrobe","Double Glazing Windows","Double Glazing Windows","Double Glazing Windows","Double Glazing Windows"])
]);

// ShowcaseModel.setDataSource([]);