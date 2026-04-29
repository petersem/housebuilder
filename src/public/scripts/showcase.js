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
    });
    window.location.replace("/showcase/render");
  } else {
    log.innerText = "Glad you're staying!";
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

// Function to be debounced
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

// Create a debounced version of the search function
const dSearch = debounce(searchTitle, 1000);

function search() {
  const searchValue = document.getElementById("searchBox").value;
  const sortTerm = document.getElementById("sort").value;
  dSearch(searchValue, sortTerm);
}

function sort() {
  const searchValue = document.getElementById("searchBox").value;
  const sortTerm = document.getElementById("sort").value;
  searchTitle(searchValue, sortTerm);
}

// set focus to title search and set cursor to end of text
const searchBox = document.getElementById('searchBox')
searchBox.focus();
searchBox.selectionStart = searchBox.selectionEnd = searchBox.value.length;

document.addEventListener("click", function (e) {
    if (e.target.matches(".delete-btn")) {
        const id = e.target.dataset.id;
        showcaseDelete(id);
    }
});

const sortOptions =  document.getElementById('sort');
sortOptions.value=sortOptions.dataset.id;

