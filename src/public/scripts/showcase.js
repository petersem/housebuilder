function showcaseDelete(id) {
  const params = id.split("||");
  console.log(params);
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
function searchTitle(query) {
    console.log('Searching for:', query);
}

// Create a debounced version of the search function
const dSearch = debounce(searchTitle, 1000);