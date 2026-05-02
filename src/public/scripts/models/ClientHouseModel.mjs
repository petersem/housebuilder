import { ClientDataModel } from "./ClientDataModel.mjs";
let uuid = self.crypto.randomUUID()

export default class ClientHouseModel extends ClientDataModel {

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

    constructor(id = null, title, companyName, rooms, bathrooms, garages, floorAreaSqm, storyCount, totalCost, extras) {
        super();
        this.id = id ?? uuid;  // if null or undefined, add a random UUID, otherwise use the id
        this.title = title;
        this.companyName = companyName;
        this.rooms = rooms;
        this.bathrooms = bathrooms;
        this.garages = garages;
        this.floorAreaSqm = floorAreaSqm;
        this.storyCount = storyCount;
        this.totalCost = totalCost;
        this.extras = extras ?? [];
    }

}

// Create sample data
//
// ClientHouseModel.setDataSource([
//     new ClientHouseModel("46ac80a9-3ea6-4481-b903-8b304764bc15", "Matt's House","DreamBuild Homes",5,2,1,300,1,1200000,["Built-in Wardrobe","Double Glazing Windows","Solar Panel Installation (Standard)"]),
//     new ClientHouseModel("46ac8019-3ea6-4481-b903-8b304764bc15", "Joe's House","DreamBuild Homes",5,2,1,400,1,765000,["Built-in Wardrobe","Double Glazing Windows"]),
//     new ClientHouseModel(null, "Matt's 2nd place", "DreamBuild Homes",5,2,1,400,1,978000,["Built-in Wardrobe","Double Glazing Windows"]),
// ]);

// const houses = ClientHouseModel.select();
localStorage.clear;
// localStorage.setItem("houses", JSON.stringify(houses)); 

// load houses from local storage and populate HouseModelArray
let houseModelArray = [];
if (localStorage.getItem("houses") != null) {
    for (let house of JSON.parse(localStorage.getItem("houses"))) {
        const newHouse = new ClientHouseModel(house["id"],
            house["title"],
            house["companyName"],
            house["rooms"],
            house["bathrooms"],
            house['garages'],
            house["floorAreaSqm"],
            house["storyCount"],
            house["totalCost"],
            house["extras"]
        )
        houseModelArray.push(newHouse);
    }

    // load data model
    ClientHouseModel.setDataSource(houseModelArray);
} else {
    ClientHouseModel.setDataSource([]);
}
