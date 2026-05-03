import { ClientHouseModel } from "../models/ClientHouseModel.mjs";


/**
 * Manages houses stored in the client local storage.
 */
export class ClientHouseController {

  /**
   * renderHouses - Builds HTML elements, based upon the contents of houses in local storage 
   */
  static renderHouses() {
    // get house list and clear houses before load
    let houseList = document.getElementById("house-list");
    houseList.innerHTML = ""; 

    // build article
    ClientHouseController.GetHouseList().forEach(house => {
      let article = document.createElement("article");
      let moneySpan = document.createElement("span");
      moneySpan.className = "money";
      moneySpan.innerText = "$" + new Intl.NumberFormat("en-AU", { maximumSignificantDigits: 3 }).format(house.totalCost);
      let titleSpan = document.createElement("span");
      titleSpan.className = "title";
      titleSpan.innerText = house.title;
      let companySpan = document.createElement("span");
      companySpan.className = "company";
      companySpan.innerText = house.companyName;

      let specsP = document.createElement("p");
      specsP.className = "specs";
      let specsSpan = document.createElement("span");


      // stories spec
      let specsStoriesI = document.createElement("i");
      let specsStoriesValue = document.createElement("span");
      specsStoriesI.className = "fa-jelly-fill fa-regular fa-rectangle-history"
      specsStoriesI.title = "stories"
      specsStoriesValue.innerText = house.storyCount;
      specsSpan.appendChild(specsStoriesI);
      specsSpan.appendChild(specsStoriesValue);
      specsP.appendChild(specsSpan);

      // rooms spec
      let specsRoomsI = document.createElement("i");
      let specsRoomsValue = document.createElement("span");
      specsRoomsI.className = "fa-jelly fa-regular fa-people-roof"
      specsRoomsI.title = "rooms"
      specsRoomsValue.innerText = house.rooms;
      specsSpan.appendChild(specsRoomsI);
      specsSpan.appendChild(specsRoomsValue);
      specsP.appendChild(specsSpan);

      // bathrooms spec
      let specsBathroomsI = document.createElement("i");
      let specsBathroomsValue = document.createElement("span");
      specsBathroomsI.className = "fa-jelly-fill fa-regular fa-bath"
      specsBathroomsI.title = "bathrooms"
      specsBathroomsValue.innerText = house.bathrooms;
      specsSpan.appendChild(specsBathroomsI);
      specsSpan.appendChild(specsBathroomsValue);
      specsP.appendChild(specsSpan);

      // garages spec
      let specsGaragesI = document.createElement("i");
      let specsGaragesValue = document.createElement("span");
      specsGaragesI.className = "fa-jelly-fill fa-regular fa-garage";
      specsGaragesI.title = "garages"
      specsGaragesValue.innerText = house.garages;
      specsSpan.appendChild(specsGaragesI);
      specsSpan.appendChild(specsGaragesValue);
      specsP.appendChild(specsSpan);

      // floorAreaSqm spec
      let specsFloorAreaSqmI = document.createElement("i");
      let specsFloorAreaSqmValue = document.createElement("span");
      specsFloorAreaSqmI.className = "fa-jelly-fill fa-regular fa-arrows-maximize";
      specsFloorAreaSqmI.title = "floor area"
      specsFloorAreaSqmValue.innerText = house.floorAreaSqm + " sqm";
      specsSpan.appendChild(specsFloorAreaSqmI);
      specsSpan.appendChild(specsFloorAreaSqmValue);
      specsP.appendChild(specsSpan);

      // extras
      let extrasDiv = document.createElement("div");
      extrasDiv.className = "extras";
      for (let e in house.extras) {
        let extraDiv = document.createElement("div");
        extraDiv.innerText = house.extras[e];
        extrasDiv.appendChild(extraDiv);
      }

      // card actions
      let cardActions = document.createElement("div");
      cardActions.className = "card-actions";
      
      // delete button
      let dltLink = document.createElement("a");
      dltLink.className = "delete-btn";
      dltLink.href="#";
      dltLink.setAttribute('data-id', house.id + "||" + house.title);
      dltLink.innerText = "Delete"
      dltLink.title = "Delete house"
      cardActions.appendChild(dltLink);
      
      // edit button
      let edtLink = document.createElement("a");
      edtLink.className = "edit-btn";
      edtLink.href="#";
      edtLink.setAttribute('data-id', house.id );
      edtLink.innerText = "Edit"
      edtLink.title = "Edit house"
      cardActions.appendChild(edtLink);
      
      // showcase button
      let scLink = document.createElement("a");
      scLink.className = "showcase-btn";
      scLink.href="#";
      scLink.setAttribute('data-id', house.id);
      scLink.innerText = "Showcase"
      scLink.title = "Add to showcase"
      cardActions.appendChild(scLink);

      // build card
      article.appendChild(moneySpan);
      article.appendChild(titleSpan);
      article.appendChild(companySpan);
      article.appendChild(specsP);
      article.appendChild(extrasDiv);
      article.appendChild(cardActions);

      // add article
      houseList.appendChild(article);
    });

  }

  static calculatePrice(house) {

  }

  static getCompanies() {

  }

  static getPricing() {
  }

  static getHouse(id) {
    return ClientHouseModel.select(house => house.id == id)
  }

  /**
   * Get House List
   * @returns All client houses
   */
  static GetHouseList() {
    return ClientHouseModel.select();
  }

  static createHouse(){

  }

  static updateHouse(id) {

    // also update showcase if published there
  }

  static deleteHouse(id) {

    // delete from showcase also
  }

  static sendToShowcase() {

  }
}