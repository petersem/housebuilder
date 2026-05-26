import { ClientDataModel } from "./ClientDataModel.mjs";
let uuid = self.crypto.randomUUID()

/**
 * CTOR requires params to create a new ClientHouseModel
 * @class ClientHouseModel
 * @classdesc Manages all _CRUD_ operations for the _ClientHouseModel_
 * @param {string} id - 34 character UUID as a unique key
 * @param {string} title - basePrice - The base price for the company
 * @param {string} companyName - The company name
 * @param {Number} rooms - The number of rooms
 * @param {Number} bathrooms - The number of bathrooms
 * @param {Number} garages - The number of garages
 * @param {Number} floorAreaSqm - The floor area in square meters
 * @param {Number} storyCount - The number of stories
 * @param {Number} totalCostgrooms - The calculated total cost
 * @param {Object[]} extras - An array of extras objects
 */
export class ClientHouseModel extends ClientDataModel {

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

  
    // override update to also save to local storage
    static update(filter, entry) {
        super.update(filter, entry);
        const houses = ClientHouseModel.select();
        localStorage.clear;
        localStorage.setItem("houses", JSON.stringify(houses))
    }

    // override insert to also save to local storage
    static insert(entry) {
        super.insert(entry);
        const houses = ClientHouseModel.select();
        localStorage.clear;
        localStorage.setItem("houses", JSON.stringify(houses))
    }

    static delete(filter) {
        super.delete(filter);
        const houses = ClientHouseModel.select();
        localStorage.clear;
        localStorage.setItem("houses", JSON.stringify(houses))
    }
}

// // load houses from local storage and populate HouseModelArray
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


