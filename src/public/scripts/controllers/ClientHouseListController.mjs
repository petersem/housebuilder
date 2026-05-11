import { ClientHouseModel } from "../models/ClientHouseModel.mjs";

/**
 * Manages houses stored in the client local storage.
 */
export class ClientHouseListController {
  /**
   * getCompany
   * @returns {Object} an array of company obects
   */
  static async getCompanies() {
    const response = await fetch("/companies/", {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      }
    })

    const json = await response.json();
    return json;
  }

  /**
   * renderHouses - Builds HTML elements, based upon the contents of houses in local storage 
   * @returns {void} 
  */
  static async renderHouses(titleSearch = "", sortTerm = "") {

    // get house list and clear houses before load
    let houseList = document.getElementById("house-list");
    houseList.innerHTML = "";

    const companyList = await ClientHouseListController.getCompanies()
      .then(data => data)
      .catch(err => console.error("Fetch error:", err));


    // build house article
    const houses = ClientHouseListController.GetHouseList(titleSearch, sortTerm)
    houses.forEach(house => {
      // add company star rating to each house
      const company = companyList.data.find(c => c.name == house.companyName);
      if (company) {
        house.companyRating = company.rating;
      }
      else {
        house.companyRating = 0;
      }



      let article = document.createElement("article");
      let moneySpan = document.createElement("span");
      moneySpan.className = "money";
      moneySpan.id = "totalCost";
      moneySpan.innerText = "$" + new Intl.NumberFormat("en-AU", { maximumSignificantDigits: 3 }).format(house.totalCost);
      moneySpan.setAttribute("data-id", house.totalCost);
      let titleSpan = document.createElement("span");
      titleSpan.className = "title";
      titleSpan.innerText = house.title;
      let companySpan = document.createElement("span");
      companySpan.className = "company";
      companySpan.innerText = house.companyName + " ";
      let companyRatingSpan = document.createElement("span");
      companyRatingSpan.className = "rating";
      companyRatingSpan.style = "--rating: " + house.companyRating
      companySpan.appendChild(companyRatingSpan);

      // specs p > span
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
      dltLink.id = "delete-btn";
      dltLink.href = "#";
      dltLink.setAttribute('data-id', house.id + "||" + house.title);
      dltLink.innerText = "Delete"
      dltLink.title = "Delete house"
      cardActions.appendChild(dltLink);

      // edit button
      let edtLink = document.createElement("a");
      edtLink.className = "edit-btn";
      edtLink.id = "edit-btn"
      edtLink.href = "#";
      edtLink.setAttribute('data-id', house.id);
      edtLink.innerText = "Edit"
      edtLink.title = "Edit house"
      cardActions.appendChild(edtLink);

      // showcase button
      let scLink = document.createElement("a");
      scLink.className = "showcase-btn";
      scLink.id = "showcase-btn";
      scLink.href = "#";
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

    const sortList = ClientHouseListController.getSortValues(houses)
    console.log(sortList)

    // add listeners for delete buttons using the house ID from the data-id attribute
    ClientHouseListController.clearListeners('delete-btn');
    document.addEventListener("click", function (e) {
      if (e.target.matches(".delete-btn")) {
        const id = e.target.dataset.id;
        ClientHouseListController.deleteConfirm(id);
      }
    });

    // add listeners for edit buttons using the house ID from the data-id attribute
    ClientHouseListController.clearListeners('edit-btn');
    document.addEventListener("click", function (e) {
      if (e.target.matches(".edit-btn")) {
        const id = e.target.dataset.id;
        ClientHouseListController.editHouse(id);
      }
    });

    // add listeners for add buttons using the house ID from the data-id attribute
    ClientHouseListController.clearListeners('showcase-btn');
    document.addEventListener("click", function (e) {
      if (e.target.matches(".showcase-btn")) {
        const id = e.target.dataset.id;
        const house = ClientHouseListController.GetHouseList().find(h => h.id == id);
        ClientHouseListController.sendToShowcase(house);
      }
    });

    // add search and sort listeners
    ClientHouseListController.clearListeners('searchBox');
    ClientHouseListController.clearListeners('sort');

    const sb = document.getElementById("searchBox");
    const srt = document.getElementById("sort");
    sb.addEventListener("selected", (e) => {
      ClientHouseListController.dSearch(sb.value, e.target.value);
    });

    sb.addEventListener("keyup", (e) => {
      ClientHouseListController.dSearch(e.target.value, srt.value);
    });

    // set focus to title search and set cursor to end of text
    // but not if search text is empty or in mobile view (stops keyboard from opening on focus in mobile)
    const searchBox = document.getElementById('searchBox');
    if (searchBox.value != "" || window.innerWidth > 600) {
      searchBox.focus();
      searchBox.selectionStart = searchBox.selectionEnd = searchBox.value.length;
    }


  }

  /**
   * getHouse - Gets a house object, given the house ID
   * @param {number} id 
   * @returns {house[]} house object
   */
  static getHouse(id) {
    return ClientHouseModel.select(house => house.id == id)
  }

  /**
   * sortBy
   * @param {Array} arr 
   * @param {string} prop 
   * @param {string} direction 
   * @returns {Array} sorted array by the given property and direction 
   */
  static sortBy(arr, prop, direction = "asc") {
    return arr.sort((a, b) => {
      const x = a[prop];
      const y = b[prop];

      if (prop.toLowerCase() == "totalCost") {
        x = parseInt(x);

      }

      if (typeof x === "number" && typeof y === "number") {
        return direction === "asc" ? x - y : y - x;
      }

      return direction === "asc"
        ? String(x).localeCompare(String(y))
        : String(y).localeCompare(String(x));
    });
  }

  /**
   * getSortValues
   * @param {Array} houses 
   * @returns {Array} data for sort array
   */
  static getSortValues(houses) {
    const sortArray = [];

    if (houses.length !== 0) {
      const props = Object.keys(houses[0]);

      for (const k of props) {
        if (k !== "id" && k !== "extras" && k != "companyRating") {
          let label = k.charAt(0).toUpperCase() + k.slice(1);
          switch (label) {
            case "CompanyName":
              label = "Company";
              break;
            case "FloorAreaSqm":
              label = "Area";
              break;
            case "StoryCount":
              label = "Stories";
              break;
            case "TotalCost":
              label = "Price";
              break;
            default:
              break;
          }
          sortArray.push({ value: `${k}|asc`, label: `${label}: asc` });
          sortArray.push({ value: `${k}|desc`, label: `${label}: desc` });
        }
      }
    }
    sortArray.push({ value: "unsorted", label: "No Sort" });
    return sortArray.reverse();
  }

  /**
   * Get House List
   * @returns {house[]} All client houses
   */
  static GetHouseList(titleSearch = "", sortTerm = "") {
    let houses;

    // manage title searches
    let searchTerm = null
    if (titleSearch.length > 0) {
      houses = ClientHouseModel.select(house => house.title.toLowerCase().includes(titleSearch.toLowerCase()));
      searchTerm = titleSearch;
    } else {
      houses = ClientHouseModel.select();
      searchTerm = "";
    }

    if (sortTerm?.length > 0) {
      const sortParams = sortTerm.split("|");
      // Sort
      houses = ClientHouseListController.sortBy(houses, sortParams[0], sortParams[1]);

    } else {
      sortTerm = "unsorted";
    }


    return houses;
  }

  /**
   * deleteConfirm - Prompts the user to confirm the deletion of a house, given the house ID. Called when the "Delete" button is clicked on a house card.
   * @param {String} id 
   */
  static deleteConfirm(id) {

    const params = id.split("||");

    if (window.confirm(`DELETE:\n     ${params[1]}?`)) {
      ClientHouseListController.deleteHouse(params[0]);
    }
  }

  /**
   * editHouse - Redirects to the house builder page with the house ID in the URL, to allow editing of the house details. Called when the "Edit" button is clicked on a house card.
   * @param {String} id 
   */
  static editHouse(id) {
    window.location.href = "/housebuilder/" + id;
  }

  /**
   * addHouse - Adds a new house to local storage and redirects to the house builder page. Called when the "Add House" button is clicked on the house list page.
   * @param {Object} newHouse object containing the details of the new house to be added, excluding the ID which is generated in the function
   */
  static addHouse(newHouse) {
    const houseToAdd = new ClientHouseModel(null, newHouse.title, newHouse.companyName, newHouse.rooms, newHouse.bathrooms, newHouse.garages, newHouse.floorAreaSqm, newHouse.storyCount, newHouse.totalCost, newHouse.extras);
    ClientHouseModel.insert(houseToAdd);
    window.location.href = "/housebuilder";
  }

  /**
   * Updates house details
   * @param {object} updatedHouse 
   */
  static updateHouse(updatedHouse) {
    const houseToUpdate = ClientHouseModel.select(house => house.id == updatedHouse.id);
    houseToUpdate.title = updatedHouse.title;
    houseToUpdate.company = updatedHouse.company;
    houseToUpdate.rooms = updatedHouse.rooms;
    houseToUpdate.bathrooms = updatedHouse.bathrooms;
    houseToUpdate.storyCount = updatedHouse.storyCount;
    houseToUpdate.floorAreaSqm = updatedHouse.floorAreaSqm;
    houseToUpdate.totalCost = updatedHouse.totalCost;
    houseToUpdate.extras = updatedHouse.extras;

    ClientHouseModel.update(house => house.id == updatedHouse.id, updatedHouse);

    window.location.href = "/housebuilder";

    // TODO: also update showcase if published there
  }

  /**
   * deleteHouse - Deletes a house from local storage, given the house ID. Also deletes from showcase if it exists there.
   * @param {String} id 
   */
  static deleteHouse(id) {
    ClientHouseModel.delete(house => house.id == id);
    // tries to delete from showcase, regardless if there or not
    ClientHouseListController.deleteFromShowcase(id);
    ClientHouseListController.renderHouses();
  }

  /**
   * deleteFromShowcase - Deletes a house from the showcase, given the house ID. Called when deleting a house from local storage to ensure it is also removed from the showcase if it exists there.
   * @param {String} houseID 
   */
  static async deleteFromShowcase(houseID) {
    fetch("/showcase/delete/", {
      method: "DELETE",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify({ "houseId": houseID })
    })
      .then(response => {
        if (!response.ok) {
          return response.statusText;
        }
      })
  }

  /**
   * sendToShowcase - Sends a house to the showcase by making a POST request to the server with the house details. Called when the "Showcase" button is clicked on a house card.
   * @param {Object} house 
   */
  static sendToShowcase(house) {
    fetch("/showcase/add/", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        "Idempotency-Key": crypto.randomUUID() // generate a unique id for this request to prevent duplicate calls
      },
      body: JSON.stringify(house)
    })
      .then(response => {
        if (response.ok) {
          toast("House sent to showcase!");
        } else {
          if (response.status == 409) {
            toast("House already in showcase!", 3000, "error");
          } else {
            toast(`Error sending to showcase: ${response.statustext}`, 3000, "error");
          }
          return response.statusText;
        }
      })
  }

  /**
   * debounce function to limit the rate at which a function can fire.
   * @param {function} func takes a function to debounce
   * @param {number} delay the delay time for the debounce in milliseconds
   * @returns {void}
   */
  static debounce(func, delay) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  }

  /**
  * Debounced version of the search function to prevent excessive calls while typing. Adjust the delay as needed.
  * @param {function} searchTitle The function to be debounced
  * @param {Number} The debounce delay in milliseconds
  * @returns {void}
  */
  static dSearch = ClientHouseListController.debounce(ClientHouseListController.renderHouses.bind(ClientHouseListController), 1000);

  /**
   * cloneNode - recreates an object without event listeners attached, but with everything else. 
   * @param {DomObject} eId 
   */
  static clearListeners(eId) {
    let old_element = document.getElementById(eId);
    let new_element = old_element.cloneNode(true);
    old_element.parentNode.replaceChild(new_element, old_element);
  }



}