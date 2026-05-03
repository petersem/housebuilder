import { ClientHouseController } from "./controllers/ClientHouseController.mjs";


// if editing, then need to populate fields, else leave blank. 
// ClientHouseController.renderEditHouse();


//TODO  update()


// 100% check that DOM has loaded before populating. x-browser safety
window.addEventListener("DOMContentLoaded", () => {

    if (window.location.href.toLowerCase().includes("housebuilder/create")) {
        // dont do anything 
        console.log('new');
    } else {
        console.log('edit');
        let parameters = window.location.href.split("/");
        let houseId = parameters[parameters.length - 1];

        const house = ClientHouseController.getHouse(houseId);
        if (house.length > 0) {
            updateValidity("title", house[0].title);
            populateCompanyDropdown("companyName", companies, house[0].companyName);
            updateValidity("rooms", house[0].rooms);
            updateValidity("bathrooms", house[0].bathrooms);
            updateValidity("storyCount", house[0].storyCount);
            updateValidity("garages", house[0].garages);
            updateValidity("floorAreaSqm", house[0].floorAreaSqm);
            const price = document.getElementById("totalCost");
            price.innerText = "$" + new Intl.NumberFormat("en-AU", { maximumSignificantDigits: 3 }).format(house[0].totalCost);
            setCheckbox("builtIns", house[0].extras.includes("Built-in Wardrobe"));
            setCheckbox("doubleGlazing", house[0].extras.includes("Double Glazing Windows"));
            setCheckbox("solarPanels", house[0].extras.includes("Solar Panel Installation (Standard)"));
        }
    }
});

/**
 * Update validity - validates data before populating form. 
 * @param {*} id 
 * @param {*} value 
 * @returns 
 */
function updateValidity(id, value) {
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
function cleanString(str) {
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
function populateCompanyDropdown(selectId, companies, selectedValue) {
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
    companies.forEach(c => {
        const opt = document.createElement("option");
        opt.value = c.value;
        opt.textContent = c.label;
        if (c.value === selectedValue) opt.selected = true;
        sel.appendChild(opt);
    });
}

// TODO need to get the real companies from a fetch
const companies = [
    { value: "DreamBuild Homes", label: "DreamBuild Homes" },
    { value: "Value Builders", label: "Value Builders" },
    { value: "Premium Living Co.", label: "Premium Living Co." }
];


/**
 * setCheckbox - wrapped to set the cb value
 * @param {*} id 
 * @param {*} value 
 * @returns 
 */
function setCheckbox(id, value) {
    const el = document.getElementById(id);
    if (!el) return;

    // value should be true or false
    el.checked = Boolean(value);
}