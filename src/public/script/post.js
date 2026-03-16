function postDelete(id) {
    fetch("/house/delete/" + id, {
  method: "POST",
  headers: {
    "Content-type": "application/json; charset=UTF-8"
  }
});
//alert('DELETED!!');
window.location.replace("/house/list");
}