function createForm() {
	const root = document.getElementById("root");
	
	// Creating Question Div
	const questionDiv = document.createElement("div");
	questionDiv.classList.add("question");

	// Adding Question Heading
	const questionHeading = document.createElement("h1");
	const headingText = document.createTextNode(`Question ${createdQuestions}`);
	questionHeading.classList.add("question__heading");
	questionHeading.appendChild(headingText);

	// Adding Question Input
	const questionInput = document.createElement("input");
	questionInput.classList.add("question__input");
	questionInput.placeholder = `Question ${createdQuestions}`;
	questionInput.id = `question${createdQuestions}`;

	// Adding Options
	let optionElements = [];

	for (let i = 0; i < 4; i++) {
		// Create Option Div, Option Input and Radio Button
		const optionDiv = document.createElement("div");
		const optionInput = document.createElement("input");
		const radio = document.createElement("div");

		// Config Option DIv
		optionDiv.classList.add("option__div");

		// Config Option Input
		optionInput.placeholder = `Option ${i+1}`;
		optionInput.id = `question${createdQuestions}option${i+1}`;
		optionInput.classList.add("option__input");

		// Config Radio Button
		radio.classList.add("radio");
		radio.classList.add(`question${createdQuestions}`);
		radio.classList.add(`question${createdQuestions}option${i+1}radio`);

		// Adding Input and Radio Button to Input Div
		optionDiv.appendChild(optionInput);
		optionDiv.appendChild(radio);
		optionElements.push(optionDiv);
	}

	// Adding Question Heading and Question Input To Question Div
	questionDiv.appendChild(questionHeading);
	questionDiv.appendChild(questionInput);

	// Adding Options To Question Div
	for (let i = 0; i < optionElements.length; i++) {
		questionDiv.appendChild(optionElements[i]);
	}

	// Adding Question Div To Root Div
	root.appendChild(questionDiv);

	// Add Listeners To New Radio Buttons
	addListeners();

	// Fix Footer
    document.getElementById("footer").style.position = "relative";
    document.getElementById("footer").style.bottom = "-19vh";

	createdQuestions++;
	handleCreateButton();
}

function createData() {
	let questions = [];
	for (let i = 0; i < createdQuestions - 1; i++) {
		let question = document.getElementById(`question${i+1}`).value;
		let toAdd = {};
		let options = {};
		for (let j = 0; j < 4; j++) {
			let option = document.getElementById(`question${i+1}option${j+1}`);
			let optionText = option.value;
			let correctAnswer = document.getElementsByClassName(`question${i+1}option${j+1}radio`)[0].id == "selected" ? true : false;
			options[optionText] = correctAnswer;
		}
		toAdd[question] = options;
		questions.push(toAdd);
	}
	return questions;
}

function sendData() {
	const questions = createData();
	const xhr = new XMLHttpRequest();
	xhr.open("POST", window.location.href, true);
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.send(JSON.stringify(questions));
	xhr.onreadystatechange = e => {
		if (xhr.responseText == "success") {
			window.location.href = "/success";
		} else {
			window.location.href = "/fail";
		};
	}
}

function editData() {
	const questions = createData();
	const xhr = new XMLHttpRequest();
	xhr.open("POST", window.location.href, true);
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.send(JSON.stringify(questions));
	xhr.onreadystatechange = e => {
		if (xhr.responseText == "success") {
			window.location.href = "/success";
		} else {
			window.location.href = "/fail";
		};
	}
}

function select(e) {
	const radios = document.getElementsByClassName(e.target.classList[1]);
	for (let i = 0; i < radios.length; i++) {
		if (radios[i].id == "selected") {
			radios[i].id = "";
			radios[i].classList.remove("selected");
		}
	}
	e.target.id = "selected";
	e.target.classList.add("selected");
	handleCreateButton();
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

function handleCreateButton() {
	const createButton = document.getElementById("create__button");
	if (document.getElementsByClassName("selected").length != createdQuestions - 1) {
		createButton.disabled = true;
	} else {
		createButton.disabled = false
	}
}

if (window.location.href.includes("/edit")) {
	if (document.getElementsByClassName("question__heading").length == 1) {
		fixFooter();
	}
} else {
	fixFooter();
}

let createdQuestions = document.getElementsByClassName("question__heading").length == 0 ? 2 : document.getElementsByClassName("question__heading").length + 1;

addListeners();

if (!window.location.href.includes("/edit")) {
	handleCreateButton();
}