class Node {
    constructor(val, next, prev) {
        this.val = val;
        this.next = next;
        this.prev = prev;
    }
}

class DoublyLinkedList {
    constructor() {
        this.head = null;
        this.curr = null;
        this.score = {};
    }

	// Adds Question Objects to Linked List as Nodes from Fetched Quiz Data
    createQuiz(data) {
        for (let i = 0; i < data.length; i++) {
            if (!this.head) {
                this.head = new Node(data[i]);
                this.curr = this.head;
            } else {
            	let itr = this.head;
           	    while (itr.next) {
                    itr = itr.next;
                }
                let to_add = new Node(data[i]);
                to_add.prev = itr;
                itr.next = to_add;
            }
        }
    }

	// Gets Length Of Linked List
	getLength() {
		let len = 0;
		let itr = this.head;
		while (itr) {
			len++;
			itr = itr.next;
		}
		return len;
	}

	// Traverses To The Next Question
    traverseNextQuestion() {
        this.curr = this.curr.next;
    }

	// Traverses To The Previous Question
    traversePreviousQuestion() {
        this.curr = this.curr.prev;
    }

	// Gets Question from Current Node
    getCurrentQuestion() {
        return Object.keys(this.curr.val)[0];
    }

	// Gets Options of Current Question
    getCurrentOptions() {
        return Object.keys(this.curr.val[this.getCurrentQuestion()]);
    }

	// Checks If There Is a Next Node
    isEnd() {
        return this.curr.next == null ? true : false;
    }

	// Checks If There Is a Previous Node
	prevExists() {
		return this.curr.prev == null ? false : true;
	}

	// Adds User Answer to Score Object
	addAnswer(answer) {
		this.score[this.getCurrentQuestion()] = answer;
	}

	// Method to Get Total Score of User
	getScore() {
		const keys = Object.keys(this.score);
		let scored = 0;
		for (let i = 0; i < keys.length; i++) {
			let key = keys[i];
			let userAnswer = this.score[key];
			let itr = this.head;
			let j = 0;
			while (j < i) {
				itr = itr.next;
				j++;
			}
			if (itr.val[key][userAnswer]) {
				scored++;
			};
		}
		return scored;
	}
}

function start() {
	// Clears Content
	document.getElementsByClassName("box")[0].remove();

	// Gets Button Div For Previous, Submit and Next Buttons
	const buttonDiv = document.getElementById("buttons");

	// Creating and Styling Prev Button
	const newPrevButton = document.createElement("button");
	const prevIcon = document.createElement("i");
	prevIcon.classList.add("fas");
	prevIcon.classList.add("fa-angle-left")
	newPrevButton.appendChild(prevIcon);
	newPrevButton.addEventListener("click", prevQuestion);
	newPrevButton.id = "prev";
	newPrevButton.classList.add("btn");
	newPrevButton.classList.add("btn-lg");
	newPrevButton.classList.add("control");

	// Creating and Styling Submit Button
	const submitButton = document.createElement("button");
	const submitButtonText = document.createTextNode("submit");
	submitButton.appendChild(submitButtonText);
	submitButton.id = "submit"
	submitButton.classList.add("btn");
	submitButton.classList.add("btn-lg");
	submitButton.classList.add("control");
	submitButton.addEventListener("click", submit);

	// Creating and Styling Next Button
	const newNextButton = document.createElement("button");
	const nextIcon = document.createElement("i");
	nextIcon.classList.add("fas");
	nextIcon.classList.add("fa-angle-right");
	newNextButton.appendChild(nextIcon);
	newNextButton.addEventListener("click", nextQuestion);
	newNextButton.id = "next";
	newNextButton.classList.add("btn");
	newNextButton.classList.add("btn-lg");
	newNextButton.classList.add("control");

	// Adding Created Buttons to Button Div
	buttonDiv.appendChild(newPrevButton);
	buttonDiv.appendChild(submitButton);
	buttonDiv.appendChild(newNextButton);

	// Starts Quiz
	displayQuiz();
}

// Function to display question and options
function displayQuiz() {
	const root = document.getElementById("root");
	const prevButton = document.getElementById("prev");
	const question = ll.getCurrentQuestion();
	const options = ll.getCurrentOptions();

	if (root.firstChild) {
		while (root.firstChild) {
			root.removeChild(root.firstChild);
		}
	}

	if (!document.getElementById("submit").disabled) {
		document.getElementById("submit").disabled = true;
	}

	const questionTag = document.createElement("h1");
	const questionText = document.createTextNode(question);
	questionTag.classList.add("question")
	questionTag.appendChild(questionText);
	root.appendChild(questionTag);

	const optionsDiv = document.createElement("div");
	optionsDiv.classList.add("options");
	root.appendChild(optionsDiv);
	let optionNodes = [];
	
	for (let i = 0; i < options.length; i++) {
		let optionInput = document.createElement("button");
		let optionText = document.createTextNode(options[i]);
		if (ll.getCurrentQuestion() in ll.score) {
			if (options[i] == ll.score[ll.getCurrentQuestion()]) {
				optionInput.id = "selected";
			}
		}
		optionInput.appendChild(optionText);
		optionInput.classList.add("option");
		optionNodes.push(optionInput);	
	}

	for (let i = 0; i < optionNodes.length; i++) {
		optionsDiv.appendChild(optionNodes[i]);
	}

	addSelectingListeners();

	if (!ll.prevExists()) {
		prevButton.disabled = true;
	} else {
		prevButton.disabled = false;
		if (!document.getElementById("prev")) {
			const prevButtonToAdd = document.createElement("button");
			const prevText = document.createTextNode("prev");
			prevButtonToAdd.appendChild(prevText);
			prevButtonToAdd.id = "prev";
			prevButtonToAdd.addEventListener("click", prevQuestion);
			buttonsDiv.appendChild(prevButtonToAdd);
		}
	}
	if (ll.isEnd()) {
		if (document.getElementById("next")) {
			document.getElementById("next").disabled = true;
		}
		document.getElementById("submit").disabled = false;
	} else {
		document.getElementById("next").disabled = false;
		if (!document.getElementById("next")) {
			const nextButtonToAdd = document.createElement("button");
			const nextText = document.createTextNode("next");
			nextButtonToAdd.appendChild(nextText);
			nextButtonToAdd.id = "next";
			nextButtonToAdd.addEventListener("click", nextQuestion);
			buttonsDiv.appendChild(nextButtonToAdd);
		}
	}
}

function addSelectingListeners() {
	const options = document.getElementsByClassName("option");
	for (let i = 0; i < options.length; i++) {
		options[i].addEventListener("click", selectOption);
	}
}

// Event Listeners
function redirectDahsboard(e) {
	window.location.href = "/dashboard";
}

function redirectBrowse(e) {
	window.location.href = "/browse";
}

function selectOption(e) {
	if (document.getElementById("selected")) {
		document.getElementById("selected").id = "";
	}
	e.target.id = "selected";
}

function nextQuestion(e) {
	if (document.getElementById("selected")) {
		ll.addAnswer(document.getElementById("selected").innerText);
	}
	ll.traverseNextQuestion();
	displayQuiz(ll);
}

function prevQuestion(e) {
	if (document.getElementById("selected")) {
		ll.addAnswer(document.getElementById("selected").innerText);
	}
	if (document.getElementById("submit")) {
		document.getElementById("submit").disabled = true;
	}
	ll.traversePreviousQuestion();
	displayQuiz(ll);
}

function submit(e) {

	const content = document.getElementById("content");
	const score = document.createElement("h1");
	const dashboardButton = document.createElement("button");
	const dahsboardText = document.createTextNode("Dashboard");
	const browseButton = document.createElement("button");
	const browseText = document.createTextNode("Browse");
	const returnButtonsDiv = document.createElement("div")

	// Adds Final Answer To Score Object
	ll.addAnswer(document.getElementById("selected").innerText);
	while (content.firstChild) {
		content.removeChild(content.firstChild);
	}

	const scoreText = document.createTextNode(`You Scored ${ll.getScore()}/${ll.getLength()}`);

	// Styles Created Elements by Adding Classes and Adds Event Listeners
	dashboardButton.appendChild(dahsboardText);
	dashboardButton.classList.add("btn");
	dashboardButton.classList.add("return");
	dashboardButton.classList.add("btn-lg");
	dashboardButton.classList.add("btn-outline-warning");
	dashboardButton.addEventListener("click", redirectDahsboard);
	browseButton.appendChild(browseText);
	browseButton.classList.add("btn");
	browseButton.classList.add("return");
	browseButton.classList.add("btn-lg");
	browseButton.classList.add("btn-outline-warning");
	browseButton.addEventListener("click", redirectBrowse);
	score.classList.add("score");
	score.appendChild(scoreText);
	content.appendChild(score);
	returnButtonsDiv.classList.add("return__div");

	// Adds Created Dashboard Button & Browse Button to Buttons Div
	returnButtonsDiv.appendChild(dashboardButton);
	returnButtonsDiv.appendChild(browseButton);

	// Adds Buttons Div To Content
	content.appendChild(returnButtonsDiv);
}

let uncleanedData = document.getElementById("json").innerHTML
let cleanedData = uncleanedData.replaceAll("'", `"`);
cleanedData = cleanedData.replaceAll("False", "false");
cleanedData = cleanedData.replaceAll("True", "true");
let data = JSON.parse(cleanedData);

ll = new DoublyLinkedList(); // Creates New DoublyLinkedList 
ll.createQuiz(data); // Creates Linked List