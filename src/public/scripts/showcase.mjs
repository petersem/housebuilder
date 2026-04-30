function showcaseDelete(id) {
  const params = id.split("||");
  
  if (window.confirm(`DELETE:\n     ${params[1]}?`)) {
    fetch("/showcase/delete/", {
      method: "DELETE",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify({
        "houseId": params[0]
      })
    })
    .then(response => window.location.reload(true));
  } 

}

// Debounce function
function debounce(func, delay) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}

/**
 * The global function for search and sorts that directs to the appropriate route. 
 * @param {String} query The title search text to search for. Can be empty or undefined if only sorting is required.
 * @param {String} sort the sort property and asc/dec delimetered by '|'
 * @returns {void}
 */
function searchTitle(query, sort = "unsorted") {
    console.log('Searching for:', query);
    console.log('Sort by:', sort);
  
    if (sort == undefined || sort == "unsorted") {
      window.location.href = "/showcase/render/" + query;
    } else {
      if ((query == undefined || query.length == 0) && sort != undefined) {
        window.location.href = "/showcase/render/unfiltered/" + sort;
      } else {
        window.location.href = "/showcase/render/" + query + "/" + sort;
      }
    }
}

/**
 * Debounced version of the search function to prevent excessive calls while typing. Adjust the delay as needed.
 * @param {function} searchTitle The function to be debounced
 * @param {Number} The debounce delay in milliseconds
 * @returns {void}
*/
const dSearch = debounce(searchTitle, 1000);

/**
 * Grouped title search and sort function to direct to the appropriate route based on the parameters provided. Uses debounce, so called when titleSearch changes
 */
function search() {
  const searchValue = document.getElementById("searchBox").value;
  const sortTerm = document.getElementById("sort").value;
  dSearch(searchValue, sortTerm);
}

/**
 * Grouped title search and sort function to direct to the appropriate route based on the parameters provided. No debounce, so called when sort criteria changes
 */
function sort() {
  const searchValue = document.getElementById("searchBox").value;
  const sortTerm = document.getElementById("sort").value;
  searchTitle(searchValue, sortTerm);
}

// set focus to title search and set cursor to end of text
const searchBox = document.getElementById('searchBox')
searchBox.focus();
searchBox.selectionStart = searchBox.selectionEnd = searchBox.value.length;

// add listeners for delete buttons using the house ID from the data-id attribute
document.addEventListener("click", function (e) {
    if (e.target.matches(".delete-btn")) {
        const id = e.target.dataset.id;
        showcaseDelete(id);
    }
});

// set the sort value, based upon selected previous value before refresh
const sortOptions =  document.getElementById('sort');
sortOptions.value=sortOptions.dataset.id;

