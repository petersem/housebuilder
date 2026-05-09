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
    // load companies and pricing data
    const companyList = await ClientHouseBuilderController.getCompanies()
      .then(data => data)
      .catch(err => console.error("Fetch error:", err));

    const pricingList = await ClientHouseBuilderController.getPricing()
      .then(data => data)
      .catch(err => console.error("Fetch error:", err));

    const companies = companyList.data;
    const pricing = pricingList.data;

    // setup for edit or new page
    if (window.location.href.toLowerCase().includes("housebuilder/create")) {
      // new entry
      ClientHouseBuilderController.populateCompanyDropdown("companyName", companies);
      document.getElementById("saveBtn").onclick = ClientHouseBuilderController.addHouse;
      document.getElementById("saveBtn").innerText = "Save Draft";

    } else {
      // Edit entry
      document.getElementById("saveBtn").onclick = ClientHouseBuilderController.updateHouse;
      document.getElementById("saveBtn").innerText = "Update Draft";

      let parameters = window.location.href.split("/");
      let houseId = parameters[parameters.length - 1];
      const house = ClientHouseBuilderController.getHouse(houseId);

      if (house.length > 0) {
        ClientHouseBuilderController.updateValidity("title", house[0].title);
        ClientHouseBuilderController.populateCompanyDropdown("companyName", companies, house[0].companyName);
        ClientHouseBuilderController.updateValidity("rooms", house[0].rooms);
        ClientHouseBuilderController.updateValidity("bathrooms", house[0].bathrooms);
        ClientHouseBuilderController.updateValidity("storyCount", house[0].storyCount);
        ClientHouseBuilderController.updateValidity("garages", house[0].garages);
        ClientHouseBuilderController.updateValidity("floorAreaSqm", house[0].floorAreaSqm);
        const price = document.getElementById("totalCost");
        price.innerText = "$" + new Intl.NumberFormat("en-AU", { maximumSignificantDigits: 3 }).format(house[0].totalCost);
        price.setAttribute("data-id", house[0].totalCost);
        ClientHouseBuilderController.setCheckbox("builtIns", house[0].extras.includes("Built-in Wardrobe"));
        ClientHouseBuilderController.setCheckbox("doubleGlazing", house[0].extras.includes("Double Glazing Windows"));
        ClientHouseBuilderController.setCheckbox("solarPanels", house[0].extras.includes("Solar Panel Installation (Standard)"));
      }
    }

    document.removeEventListener("DOMContentLoaded", () => { });
    document.removeEventListener("input", () => { }); 

    document.addEventListener("input", async () => {
      const form = document.querySelector("form");
      const saveBtn = document.getElementById("saveBtn");

      if (form.checkValidity()) {
        saveBtn.style.display = "inline-block";


        // calculate price 
          let extras = [];
          const bi = document.getElementById("builtIns");
          if (bi.checked) extras.push("Built-in Wardrobe")

          const dg = document.getElementById("doubleGlazing");
          if (dg.checked) extras.push("Double Glazing Windows")
          const sp = document.getElementById("solarPanels");
          if (sp.checked) extras.push("Solar Panel Installation (Standard)")

          const newHouse = {
            title: document.getElementById("title").value,
            companyName: document.getElementById("companyName").value,
            bathrooms: document.getElementById("bathrooms").value,
            extras: extras,
            floorAreaSqm: document.getElementById("floorAreaSqm").value,
            garages: document.getElementById("garages").value,
            rooms: document.getElementById("rooms").value,
            storyCount: document.getElementById("storyCount").value,
            totalCost: document.getElementById("totalCost").getAttribute("data-id")
          }

          newHouse.totalCost = await ClientHouseBuilderController.calculatePrice(newHouse);
          const price = document.getElementById("totalCost");
          price.innerText = "$" + new Intl.NumberFormat("en-AU", { maximumSignificantDigits: 3 }).format(newHouse.totalCost);
          price.setAttribute("data-id", newHouse.totalCost);

      } else {
        saveBtn.style.display = "none";
      }
    });

    document.addEventListener("DOMContentLoaded", () => {
      const form = document.querySelector("form");
      const saveBtn = document.getElementById("saveBtn");

      if (form.checkValidity()) {
        saveBtn.style.display = "inline-block";
      } else {
        saveBtn.style.display = "none";
      }
    });
  }

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

  static async addHouse() {
    let extras = [];
    const bi = document.getElementById("builtIns");
    if (bi.checked) extras.push("Built-in Wardrobe")

    const dg = document.getElementById("doubleGlazing");
    if (dg.checked) extras.push("Double Glazing Windows")
    const sp = document.getElementById("solarPanels");
    if (sp.checked) extras.push("Solar Panel Installation (Standard)")

    const newHouse = {
      title: document.getElementById("title").value,
      companyName: document.getElementById("companyName").value,
      bathrooms: document.getElementById("bathrooms").value,
      extras: extras,
      floorAreaSqm: document.getElementById("floorAreaSqm").value,
      garages: document.getElementById("garages").value,
      rooms: document.getElementById("rooms").value,
      storyCount: document.getElementById("storyCount").value,
      totalCost: document.getElementById("totalCost").getAttribute("data-id")
    }

    newHouse.totalCost = await ClientHouseBuilderController.calculatePrice(newHouse);

    const houseToAdd = new ClientHouseModel(null, newHouse.title, newHouse.companyName, newHouse.rooms, newHouse.bathrooms, newHouse.garages, newHouse.floorAreaSqm, newHouse.storyCount, newHouse.totalCost, newHouse.extras);
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

    let extras = [];
    const bi = document.getElementById("builtIns");
    if (bi.checked) extras.push("Built-in Wardrobe")

    const dg = document.getElementById("doubleGlazing");
    if (dg.checked) extras.push("Double Glazing Windows")
    const sp = document.getElementById("solarPanels");
    if (sp.checked) extras.push("Solar Panel Installation (Standard)")

    const newHouse = {
      id: houseId,
      title: document.getElementById("title").value,
      companyName: document.getElementById("companyName").value,
      bathrooms: document.getElementById("bathrooms").value,
      extras: extras,
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

    await ClientHouseBuilderController.updateShowcase(newHouse);

    window.location.href = "/housebuilder";

  }


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
   * sendToShowcase - sends the house to the showcase endpoint to be added to the public showcase
   * @param {Object} house 
   */
  static sendToShowcase(house) {
    fetch("/showcase/add", {
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

          toast("House already in showcase!", 3000, "error");
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
    el.dispatchEvent(new Event("input", { bubbles: true }));
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
      .replace(/\uFEFF/g, '')    // BOM
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
    // TODO - get this data from fetch of company api
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

  /**
 * setCheckbox - wrapped to set the cb value
 * @param {*} id 
 * @param {*} value 
 * @returns 
 */
  static setCheckbox(id, value) {
    const el = document.getElementById(id);
    if (!el) return;

    // value should be true or false
    el.checked = Boolean(value);
  }

}
