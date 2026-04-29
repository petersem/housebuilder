const hamburger = document.getElementById("hamburger");
const menu = document.querySelector("nav ul");
const subToggle = document.querySelector(".sub-toggle");
const subMenu = document.querySelector(".sub-menu");

if (hamburger && menu) {
    hamburger.addEventListener("click", () => {
        menu.classList.toggle("open");
    });
}

if (subToggle && subMenu) {
    subToggle.addEventListener("click", () => {
        subMenu.classList.toggle("open");
    });
}

document.addEventListener("click", function (e) {
    if (e.target.matches(".delete-btn")) {
        const id = e.target.dataset.id;
        showcaseDelete(id);
    }
});
