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
		radio.classList.add(`question${createdQuestions+1}`);

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
}

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

fixFooter();

let createdQuestions = 2;
addListeners();