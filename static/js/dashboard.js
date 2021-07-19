function create() {
    window.location.href = "/create";
}

function fix() {
    const footer = document.getElementById("footer");
    const create = document.getElementById("create");
    footer.style.position = "relative";
    create.style.top = "5vh";
}

if (document.getElementsByClassName("quiz").length != 0) {
    fix();
}
