function hover(id) {
    const thumbnail = document.getElementById(id);
    const hover = document.getElementById("hover" + id);
    const quizDiv = document.getElementById("quiz" + id);
    thumbnail.style.visibility = "hidden";
    hover.style.visibility = "visible";
    hover.style.color = "white";
}

function undo(id) {
    const thumbnail = document.getElementById(id);
    const hover = document.getElementById("hover" + id);
    const quizDiv = document.getElementById("quiz" + id);
    thumbnail.style.visibility = "visible";
    hover.style.visibility = "hidden";
    hover.style.color = "white";
}

function fixFooter() {
    document.getElementById("footer").style.position = "absolute";
}

function start(id) {
    window.location.href = "/quiz/" + id
}

if (document.getElementsByClassName("quiz").length === 0) {
    fixFooter();
}