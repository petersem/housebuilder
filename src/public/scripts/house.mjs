function houseDelete(id) {
    fetch("/house/delete/", {
  method: "DELETE",
  headers: {
    "Content-type": "application/json"
  },
  body: JSON.stringify({
    "houseId": id
  })
});
window.location.replace("/house/list");
}

function addShowcase(house) {
    fetch("/showcase/add/", {
  method: "POST",
  headers: {
    "Content-type": "application/json"
  },
  body: JSON.stringify({
    "house": house
  })
});
window.location.replace("/showcase/list");
}
