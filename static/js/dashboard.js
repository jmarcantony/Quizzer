function create() {
    window.location.href = "/create";
}

function delete_quiz(quiz_id) {
    window.location.href = "/delete/" + quiz_id;
}

function edit_quiz(quiz_id) {
    window.location.href = "/edit/" + quiz_id;
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
