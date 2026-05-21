import { ClientHouseModel } from "../models/ClientHouseModel.mjs";

/**
 * Manages houses stored in the client local storage.
 */
export class ClientHouseBuilderController {

  /**
   * renderHouses - Builds HTML elements, based upon the contents of houses in local storage 
   * @returns {void} 
  */
  static async renderEdit() {
    let isHydrating = true;
    
    // load companies and pricing data
    const companyList = await ClientHouseBuilderController.getCompanies()
      .then(data => data)
      .catch(err => console.error("Fetch error:", err));

    const pricingList = await ClientHouseBuilderController.getPricing()
      .then(data => data)
      .catch(err => console.error("Fetch error:", err));

    const companies = companyList.data;
    const pricing = pricingList.data;
    const extras = pricing[0].extras

    // build out the extras section for new or edit page
    extras.forEach((e) => {
      let checkboxDiv = document.getElementById("checkbox-row");
      const div = document.createElement("div");
      div.className = "extraItem";

      // button
      const btnLeft = document.createElement("i");
      btnLeft.className = "fa-sharp fa-regular fa-circle-arrow-left"
      btnLeft.id = 'button-less-' + e.extra.toLowerCase().replaceAll(" ", "_");

      // count span
      const count = document.createElement("span");
      count.id = 'extra-count-' + e.extra.replaceAll(" ", "_");
      count.textContent = 0;

      // button
      const btnRight = document.createElement("i");
      btnRight.className = "fa-sharp fa-regular fa-circle-arrow-right"
      btnRight.id = 'button-more-' + e.extra.toLowerCase().replaceAll(" ", "_");

      // count span
      const label = document.createElement("span");
      label.textContent = " " + e.extra;

      //add click behaviour
      btnLeft.addEventListener("click", () => {
        if (parseInt(count.textContent) > 0) {
          count.textContent = Number(count.textContent) - 1;
          
          // trigger an onInput event to force price calculation when extras decrease button clicked
          const el = document.querySelector("#title");
          el.dispatchEvent(new Event("input", { bubbles: true }));          
        } else {
          toast(`Cannot have less than zero ${e.extra + ((e.extra[e.extra.length - 1].toLowerCase() != "s") ? "s" : "")}`,
            3000,
            "warning")
        }
      });

      //add click behaviour
      btnRight.addEventListener("click", () => {
        if (e.maxValue != 0 && e.maxValue <= parseInt(count.textContent)) {
          toast(`Cannot add more than ${e.maxValue} ${e.extra + ((parseInt(count.textContent) > 1 && e.extra[e.extra.length - 1].toLowerCase() != "s") ? "s" : "")}`,
            3000,
            "warning")
        } else {
          count.textContent = Number(count.textContent) + 1;

          // trigger an onInput event to force price calculation when extras increase button clicked          
          const el = document.querySelector("#title");
          el.dispatchEvent(new Event("input", { bubbles: true }));          
        
        }
      });

      // append to container
      div.appendChild(btnLeft);
      div.appendChild(count);
      div.appendChild(btnRight);
      div.appendChild(label);
      checkboxDiv.appendChild(div);
    });


    // setup for edit or new page
    if (window.location.href.toLowerCase().includes("housebuilder/create")) {
      // new entry
      ClientHouseBuilderController.populateCompanyDropdown("companyName", companies);
      document.getElementById("saveBtn").onclick = ClientHouseBuilderController.addHouse;
      document.getElementById("saveBtn").innerText = "Save Draft";
      saveBtn.disabled = true;
    } else {
      // Edit entry
      document.getElementById("saveBtn").onclick = ClientHouseBuilderController.updateHouse;
      document.getElementById("saveBtn").innerText = "Update Draft";

      let parameters = window.location.href.split("/");
      let houseId = parameters[parameters.length - 1];
      const house = ClientHouseBuilderController.getHouse(houseId);

      if (house.length > 0) {
        // count the number of each extra in extra array
        const counts = house[0].extras.reduce((acc, value) => {
          acc[value] = (acc[value] || 0) + 1;
          return acc;
        }, {});

        //build a new extras array with unique extras and included counts
        const extraCounts = [];
        for (const [key, value] of Object.entries(counts)) {
          extraCounts.push({key, value})
        }
        
        ClientHouseBuilderController.updateValidity("title", house[0].title);
        ClientHouseBuilderController.populateCompanyDropdown("companyName", companies, house[0].companyName);
        ClientHouseBuilderController.updateValidity("rooms", house[0].rooms);
        ClientHouseBuilderController.updateValidity("bathrooms", house[0].bathrooms);
        ClientHouseBuilderController.updateValidity("storyCount", house[0].storyCount);
        ClientHouseBuilderController.updateValidity("garages", house[0].garages);
        ClientHouseBuilderController.updateValidity("floorAreaSqm", house[0].floorAreaSqm);
        const price = document.getElementById("totalCost");
        price.innerText = new Intl.NumberFormat("en-AU", { 
          style: "currency", 
          currency: "AUD", 
          minimumFractionDigits: 0, 
          maximumFractionDigits: 0 
        }).format(house[0].totalCost);
        price.setAttribute("data-id", house[0].totalCost);
        
        // load up saved extras values
        let checkboxDiv = document.getElementById("checkbox-row");
        const nodes = document.querySelectorAll(".extraItem");
        nodes.forEach(n => {
          const ext = n.querySelector("span").id.replace("extra-count-", "").replaceAll("_", " ");
          const fec = extraCounts.filter(ec => ec.key == ext )
          if (fec.length > 0) n.querySelector("span").innerText = fec[0].value
        });
      }
    }

    document.addEventListener("input", async () => {
      if (isHydrating) return; // ignore synthetic events during load
      const form = document.querySelector("form");
      const saveBtn = document.getElementById("saveBtn");

      if (form.checkValidity()) {
        saveBtn.style.display = "inline-block";
        saveBtn.disabled = false;

        // calculate price 
        const newHouse = {
          title: document.getElementById("title").value,
          companyName: document.getElementById("companyName").value,
          bathrooms: document.getElementById("bathrooms").value,
          extras: ClientHouseBuilderController.createExtrasArray(),
          floorAreaSqm: document.getElementById("floorAreaSqm").value,
          garages: document.getElementById("garages").value,
          rooms: document.getElementById("rooms").value,
          storyCount: document.getElementById("storyCount").value,
          totalCost: document.getElementById("totalCost").getAttribute("data-id")
        }

        newHouse.totalCost = await ClientHouseBuilderController.calculatePrice(newHouse);
        const price = document.getElementById("totalCost");
        price.innerText = new Intl.NumberFormat("en-AU", { 
          style: "currency", 
          currency: "AUD", 
          minimumFractionDigits: 0, 
          maximumFractionDigits: 0 
        }).format(newHouse.totalCost);
        price.setAttribute("data-id", newHouse.totalCost);

      } else {
        saveBtn.disabled = true;
      }
    });

    isHydrating = false;
  }

  /**
   * createExtrasArray is used to create a save/update/add compatible house.extras array
   * @returns {extras[]} an array of extras
   */
  static createExtrasArray() {
    // create a count object for each extras item
    let newCounts = {}
    const nodes = document.querySelectorAll(".extraItem")
    nodes.forEach(node => {
      const ext = node.querySelector("span").id.replace("extra-count-", "").replaceAll("_", " ");
      const cnt = parseInt(node.querySelector("span").innerText);
      newCounts[ext] = cnt;
    });
    // populate an array with the extras
    let newExtras = []
    for (const [key, value] of Object.entries(newCounts)) {
      for (let i = 1; i <= value; i++) {
        newExtras.push(key);
      }
    }
    return newExtras;
  }

  /**
   * calculatePrice - Calculates the total price for a given house based on its specifications and the current pricing data.
   * @param {Object} house - The house object for which to calculate the price.
   * @returns {Promise<number>} - A promise resolving to the calculated total price.
   */
  static async calculatePrice(house) {
    // load companies and pricing data
    const companyList = await ClientHouseBuilderController.getCompanies()
      .then(data => data)
      .catch(err => {
        console.error("Fetch error:", err);
        toast("Error fetching company data: " + err, 3000, "error");
        return { data: [] }; // return empty data to prevent further errors
      });

    const pricingList = await ClientHouseBuilderController.getPricing()
      .then(data => data)
      .catch(err => {
        console.error("Fetch error:", err);
        toast("Error fetching pricing data: " + err, 3000, "error");
        return { data: [] }; // return empty data to prevent further errors
      });

    const companies = companyList.data;
    const pricing = pricingList.data;

    let companyBasePrice = 0;
    let totalRoomPrice = 0;
    let totalBathroomPrice = 0;
    let totalGarargePrice = 0;
    let totalSqmPrice = 0;
    let totalExtrasPrice = 0;

    // get company base price
    companyBasePrice = companies.filter(comp => comp.name == house.companyName)[0].basePrice;

    // calculate other costs
    totalRoomPrice = house.rooms * pricing[0].perRoom;
    totalBathroomPrice = house.bathrooms * pricing[0].perBathroom;
    totalGarargePrice = house.garages * pricing[0].perGarage;
    totalSqmPrice = house.floorAreaSqm * pricing[0].perSqm;

    // calculate any extras
    house.extras.forEach(extra => {
      totalExtrasPrice += [pricing[0].extras.find((ex) => ex.extra == extra)][0].price;
    });

    // return total cost
    return (companyBasePrice + totalRoomPrice + totalBathroomPrice + totalGarargePrice + totalSqmPrice + totalExtrasPrice);

  }

  /**
   * getCompanies
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
  * getPricing
  * @returns array of price objects
  */
  static async getPricing() {
    const response = await fetch("/pricing/", {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      }
    })

    const json = await response.json();
    return json;

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
   * Get House List
   * @returns {house[]} All client houses
   */
  static GetHouseList() {
    return ClientHouseModel.select();
  }

  /**
   * addHouse - Adds a new house to local storage and redirects to the house builder page. Called when the "Add House" button is clicked on the house list page.
   * @returns {void} 
   */
  static async addHouse() {

    const newHouse = {
      title: document.getElementById("title").value,
      companyName: document.getElementById("companyName").value,
      bathrooms: document.getElementById("bathrooms").value,
      extras: ClientHouseBuilderController.createExtrasArray(),
      floorAreaSqm: document.getElementById("floorAreaSqm").value,
      garages: document.getElementById("garages").value,
      rooms: document.getElementById("rooms").value,
      storyCount: document.getElementById("storyCount").value,
      totalCost: document.getElementById("totalCost").getAttribute("data-id")
    }

    newHouse.totalCost = await ClientHouseBuilderController.calculatePrice(newHouse);

    const houseToAdd = new ClientHouseModel(
      null, 
      newHouse.title, 
      newHouse.companyName, 
      newHouse.rooms, 
      newHouse.bathrooms, 
      newHouse.garages, 
      newHouse.floorAreaSqm, 
      newHouse.storyCount, 
      newHouse.totalCost, 
      newHouse.extras
    );
    ClientHouseModel.insert(houseToAdd);
    window.location.href = "/housebuilder";
  }

  /**
   * Updates house details
   * @param {object} updatedHouse 
   */
  static async updateHouse() {
    let parameters = window.location.href.split("/");
    let houseId = parameters[parameters.length - 1];

    const newHouse = {
      id: houseId,
      title: document.getElementById("title").value,
      companyName: document.getElementById("companyName").value,
      bathrooms: document.getElementById("bathrooms").value,
      extras: ClientHouseBuilderController.createExtrasArray(),
      floorAreaSqm: document.getElementById("floorAreaSqm").value,
      garages: document.getElementById("garages").value,
      rooms: document.getElementById("rooms").value,
      storyCount: document.getElementById("storyCount").value,
      totalCost: document.getElementById("totalCost").getAttribute("data-id")
    }

    newHouse.totalCost = await ClientHouseBuilderController.calculatePrice(newHouse);

    const houseToUpdate = ClientHouseModel.select(house => house.id == newHouse.id);
    houseToUpdate.title = newHouse.title;
    houseToUpdate.company = newHouse.company;
    houseToUpdate.rooms = newHouse.rooms;
    houseToUpdate.bathrooms = newHouse.bathrooms;
    houseToUpdate.storyCount = newHouse.storyCount;
    houseToUpdate.floorAreaSqm = newHouse.floorAreaSqm;
    houseToUpdate.totalCost = newHouse.totalCost;
    houseToUpdate.extras = newHouse.extras;
    ClientHouseModel.update(house => house.id == newHouse.id, newHouse);

    window.location.href = "/housebuilder";

  }

  /**
   * updateShowcase - Sends an updated house object to the server to update the corresponding entry in the public showcase. Called after a house is updated in the builder, to ensure the showcase reflects the latest details.
   * @param {Object} house object 
   */
  static async updateShowcase(house) {
    fetch("/showcase/update", {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
        "Idempotency-Key": crypto.randomUUID() // generate a unique id for this request to prevent duplicate calls
      },
      body: JSON.stringify(house)
    })
      .then(response => {
        if (!response.ok) {
          toast("Error sending to showcase: " + response.statusText, 3000, "error");
          return response.statusText;
        }
      })
  }

 /**
 * Update validity - validates data (form regex)before populating form. 
 * @param {*} id 
 * @param {*} value 
 * @returns 
 */
  static updateValidity(id, value) {
    const el = document.getElementById(id);
    if (!el) return;
    el.value = value;
    // Reset browser's cached invalid state
    //el.setCustomValidity("");
    // Force browser to re-evaluate pattern + required
    el.checkValidity();
    // Trigger UI update for :invalid / :valid CSS
    // el.dispatchEvent(new Event("input", { bubbles: true }));
  }

  /**
   * cleanString - clean malicious characters
   * @param {*} str 
   * @returns 
   */
  static cleanString(str) {
    return str
      .replace(/\u00A0/g, ' ')   // non-breaking space → normal space
      .replace(/\u200B/g, '')    // zero-width space
      .replace(/\uFEFF/g, '')    // Byte Order Mark
      .replace(/[’]/g, "'")      // smart apostrophe → normal
      .replace(/[–]/g, "-")      // en dash → hyphen
      .replace(/[“”]/g, '"')     // smart quotes → normal
      .trim();
  }

  /**
   * populateCompanyDropdown - rebuilds the dropdown with valid companies and sets the selected value
   * @param {*} selectId 
   * @param {*} companies 
   * @param {*} selectedValue 
   * @returns 
   */
  static populateCompanyDropdown(selectId, comps, selectedValue = null) {
    const sel = document.getElementById(selectId);
    if (!sel) return;

    // Clear existing options
    sel.innerHTML = "";

    // Placeholder
    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.disabled = true;
    placeholder.selected = !selectedValue;
    placeholder.textContent = "Select a company…";
    sel.appendChild(placeholder);
    // Populate
    comps.forEach(c => {
      const opt = document.createElement("option");
      opt.value = c.name;
      opt.textContent = c.name;
      if (c.name == selectedValue) opt.selected = true;
      sel.appendChild(opt);
    });
  }


}
