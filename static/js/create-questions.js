function select(e) {
	const radios = document.getElementsByClassName(e.target.classList[1]);
	for (let i = 0; i < radios.length; i++) {
		if (radios[i].id == "selected") {
			radios[i].id = "";
		}
	}
	e.target.id = "selected";
}

function addListeners() {
	const radios = document.getElementsByClassName("radio");
	for (let i = 0; i < radios.length; i++) {
		radios[i].addEventListener("click", select);
	}
}

function fixFooter() {
    document.getElementById("footer").style.position = "absolute";
    document.getElementById("footer").style.bottom = "0";
}

if (document.getElementsByClassName("question").length < 3) {
    fixFooter()
}

addListeners();