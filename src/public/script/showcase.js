function showcaseDelete(id) {
    fetch("/showcase/delete/", {
  method: "DELETE",
  headers: {
    "Content-type": "application/json"
  },
  body: JSON.stringify({
    "houseId": id
  })
});
window.location.replace("/showcase/list");
}